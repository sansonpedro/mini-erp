import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const companySchema = z.object({
  name: z.string().trim().min(2, "Enter your company name."),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
