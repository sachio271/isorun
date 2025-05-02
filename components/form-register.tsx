"use client";

// import { LoginSchema } from "@/lib/zod";
// import { getSession, signIn } from "next-auth/react";
import { signUp } from "@/lib/action";
import { RegisterSchema } from "@/lib/zod";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast } from "./toast-notification";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const FormRegister = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    // ✅ Validate inputs
    const validated = RegisterSchema.safeParse(values);
    if (!validated.success) {
        setErrors(validated.error.flatten().fieldErrors);
        setLoading(false);
        return;
    }

    const res = await signUp(formData);

    if (res?.error) {
        showToast({
            title: "Registration failed!",
            description: res.error[0],
            type: "error",
        });
    } else {
        showToast({
            title: "Registration successful!",
            description: "You can now login.",
            type: "success",
        });
        router.push("/login");
    }

    setLoading(false);
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
                Create an account to start using our services.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-1">
                        <Label htmlFor="ektp">EKTP</Label>
                        <Input
                            id="ektp"
                            type="text"
                            name="ektp"
                            placeholder="35012345678901234"
                            required
                        />
                        {errors.ektp && (
                            <div className="text-red-500 text-sm mt-2">{errors.ektp[0]}</div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="johnDoe"
                            required
                        />
                        {errors.username && (
                            <div className="text-red-500 text-sm mt-2">{errors.username[0]}</div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="johnDoe"
                            required
                        />
                        {errors.username && (
                            <div className="text-red-500 text-sm mt-2">{errors.name[0]}</div>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" name="password" required />
                        {errors.password && (
                            <div className="text-red-500 text-sm mt-2">{errors.password[0]}</div>
                        )}
                    </div>
                    <Button type="submit" className="w-full">
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                        Sign in
                    </a>
                </div>
            </form>
        </CardContent>
    </Card>
  );
};

export default FormRegister;
