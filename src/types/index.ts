import { z } from "zod";

export const resumeEntrySchema = z.object({
  id: z.string().optional(), // Optional for new entries, required for existing
  companyName: z.string().min(1, "Company name is required"),
  resumeLink: z.string().url("Resume link must be a valid URL"),
  registrationDate: z.date({ required_error: "Registration date is required" }),
  stipend: z.coerce.number().min(0, "Stipend must be non-negative").optional().default(0),
  note: z.string().optional(),
  image: z.string().optional(), // Will store image as Data URI
});

export type ResumeFormData = z.infer<typeof resumeEntrySchema>;

export interface ResumeEntry extends ResumeFormData {
  id: string; // Always present after creation
  // Validation fields removed
}
