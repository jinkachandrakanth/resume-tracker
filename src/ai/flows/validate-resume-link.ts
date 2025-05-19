
// 'use server';

/**
 * @fileOverview A resume link validator AI agent.
 *
 * - validateResumeLink - A function that handles the resume link validation process.
 * - ValidateResumeLinkInput - The input type for the validateResumeLink function.
 * - ValidateResumeLinkOutput - The return type for the validateResumeLink function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateResumeLinkInputSchema = z.object({
  resumeLink: z
    .string()
    .url()
    .describe('The link to the resume to be validated.'),
  companyName: z.string().describe('The name of the company the resume is for.'),
});
export type ValidateResumeLinkInput = z.infer<typeof ValidateResumeLinkInputSchema>;

const ValidateResumeLinkOutputSchema = z.object({
  isValid: z.boolean().describe('Whether or not the resume link is valid.'),
  linkValidationTips: z
    .string()
    .describe('Tips for improving the resume or the application process at the company, or reasons why the link is considered invalid.'),
});
export type ValidateResumeLinkOutput = z.infer<typeof ValidateResumeLinkOutputSchema>;

export async function validateResumeLink(input: ValidateResumeLinkInput): Promise<ValidateResumeLinkOutput> {
  return validateResumeLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateResumeLinkPrompt',
  input: {schema: ValidateResumeLinkInputSchema},
  output: {schema: ValidateResumeLinkOutputSchema},
  prompt: `You are a resume expert. Your task is to evaluate if a given resume link is likely to be a valid, publicly accessible, direct link to a resume document (e.g., a PDF or Word document). You cannot actually access the internet to check the link.

Resume Link: {{{resumeLink}}}
Company Name: {{{companyName}}}

Consider the following to determine validity based on the URL structure:
1.  **Is it a direct link to a specific file?**
    *   **Valid examples:** Links that seem to point directly to a document file. This includes URLs ending in .pdf, .doc, .docx. Also, URLs from services like Google Drive, OneDrive, or Dropbox that are structured as direct, publicly shareable links to a single file (e.g., Google Drive links often contain '/file/d/' and '/view?usp=sharing', OneDrive links might contain '/:f:/g/', Dropbox links might contain '/s/' or '/scl/fi/' followed by '?dl=0' or similar direct download/view parameters).
    *   **Invalid examples:** Links that appear to point to a general cloud storage *folder* (e.g., a Google Drive folder listing multiple files, a Dropbox folder view) or a generic *landing page* of a cloud service that requires further navigation or login to access the actual resume file. The recruiter needs to be able to open the resume directly.
2.  **Is it likely publicly accessible without special login?**
    *   **Valid:** Assume public accessibility if it looks like a standard shareable link for a file as described above.
    *   **Invalid:** If the URL structure strongly suggests it's an internal company portal link, an edit-only link that hasn't been made viewable to anyone with the link, or a link that would typically require the recipient to log in to a specific platform (beyond normal public sharing) just to view the file.
3.  **Focus on direct file access:** Your primary goal is to differentiate between a URL that directly serves or displays a document, and a URL that leads to a container (folder) or a platform page requiring interaction or login.

Based on your assessment of the URL structure:
- Set the 'isValid' field to true if the link appears to be a direct, publicly accessible link to a resume document. Otherwise, set 'isValid' to false.
- Provide 'linkValidationTips'.
  - If 'isValid' is false, explain *why* based on the criteria above (e.g., "This link seems to point to a cloud storage folder, not a direct file. Please provide a direct, shareable link to the resume document." or "This link's structure suggests it might require a login or isn't a direct file link. Please ensure it's a publicly accessible, direct link.").
  - If 'isValid' is true, you can offer general tips for improving the resume or the application process for the specified company, or simply state that the link format appears suitable.

Ensure your response adheres to the output schema.`,
});

const validateResumeLinkFlow = ai.defineFlow(
  {
    name: 'validateResumeLinkFlow',
    inputSchema: ValidateResumeLinkInputSchema,
    outputSchema: ValidateResumeLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
