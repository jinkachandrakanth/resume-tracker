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
    .describe('Tips for improving the resume or the application process at the company.'),
});
export type ValidateResumeLinkOutput = z.infer<typeof ValidateResumeLinkOutputSchema>;

export async function validateResumeLink(input: ValidateResumeLinkInput): Promise<ValidateResumeLinkOutput> {
  return validateResumeLinkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateResumeLinkPrompt',
  input: {schema: ValidateResumeLinkInputSchema},
  output: {schema: ValidateResumeLinkOutputSchema},
  prompt: `You are a resume expert. Determine if the provided resume link is valid and provide tips to improve the resume or application process.\n\nResume Link: {{{resumeLink}}}\nCompany Name: {{{companyName}}}\n\nDetermine if the link is valid and provide tips to improve the resume or application process for the specified company. Set the isValid field to true if the link is valid, and false otherwise.  Provide useful advice in linkValidationTips.`,
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
