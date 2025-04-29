import { object, string } from "zod";

export const LoginSchema = object({
    username: string(),
    password: string().min(6, "Password must be more than 6 characters"),
});