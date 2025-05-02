'use server';

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import axiosInstance from "./axiosInstance";
import { LoginSchema, RegisterSchema } from "./zod";

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

export const signUp = async (
  formData: FormData
) => {
  const validated = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validated.success) {
    return {
      error: validated.error.flatten().fieldErrors,
    };
  }
  const data = {
    ...validated.data,
    role: "user",
  }

  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    const message =
      error.response?.data?.message || "Registration request failed. Please try again.";
    return {
      error: [message],
    };
  }
}