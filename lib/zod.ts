import { object, string } from "zod";

export const LoginSchema = object({
    username: string(),
    password: string().min(6, "Password must be more than 6 characters"),
});

export const RegisterSchema = object({
    ektp: string(),
    username: string(),
    name: string(),
    password: 
    string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be no more than 32 characters long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least one number",
    }),
});