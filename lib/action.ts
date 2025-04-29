'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "./zod";

interface ActionState {
  error?: {
    username?: string[];
    password?: string[];
  };
  message?: string;
}

export const signInCredentials = async (
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | null> => {
  const validated = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validated.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { message: "Invalid credentials" };
        default:
          return { message: "An unexpected error occurred" };
      }
    }
    throw error;
  }

  return null; // return null on success to indicate no error
};
