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
  prompt: `You are a resume expert. Your task is to evaluate if a given resume link is likely to be a valid, accessible resume document (e.g., a direct link to a PDF or Word document).

Resume Link: {{{resumeLink}}}
Company Name: {{{companyName}}}

Consider the following when determining validity:
- A link to a general cloud storage folder (like a Google Drive folder, Dropbox folder, etc.) is NOT a valid resume link; it should be a direct link to the specific resume file.
- A link that likely requires a login, special permissions, or is not publicly accessible is NOT a valid resume link for an application.
- The link should ideally point to a common document format (e.g., .pdf, .doc, .docx). While you cannot access the link, evaluate the URL structure for clues.

Based on your assessment:
1. Set the 'isValid' field to true if the link appears to be a direct, publicly accessible link to a resume document. Otherwise, set 'isValid' to false.
2. Provide 'linkValidationTips'.
   - If 'isValid' is false, explain why the link is not considered valid (e.g., "This link appears to be for a cloud storage folder, not a direct file. Please provide a shareable link directly to the resume document." or "This link may require login or specific permissions. Please ensure it's a publicly accessible link to your resume.").
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
