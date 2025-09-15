"use client";

// import { LoginSchema } from "@/lib/zod";
// import { getSession, signIn } from "next-auth/react";
import { LoginSchema } from "@/lib/zod";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showToast } from "./toast-notification";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const FormLogin = () => {
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
    const validated = LoginSchema.safeParse(values);
    if (!validated.success) {
        setErrors(validated.error.flatten().fieldErrors);
        setLoading(false);
        return;
    }

    const res = await signIn("credentials", {
      ...validated.data,
      redirect: false,
    });

    if (res?.error) {
        showToast({
            title: "Something went wrong!",
            description: "Invalid credentials.",
            type: "error",
        });
    } else {
        const session = await getSession();
        const role = session?.user?.role;
        if (role === "admin") {
            router.push("/admin");
        } 
        else if (role === "support") {
            router.push("/support/registration");
        }
        else {
            router.push("/");
        }
    }

    setLoading(false);
  };

  return (
    <Card className="bg-white/30 backdrop-blur-md shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl text-white">Login</CardTitle>
            <CardDescription className="text-sm text-blue-300">
                Masukan EKTP dan Password untuk login
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="EKTP" className="text-white">EKTP</Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        className="bg-white/30 text-white placeholder:text-white"
                        placeholder="NIK EKTP"
                        required
                    />
                    {errors.username && (
                        <div className="text-red-500 text-sm mt-2">{errors.username[0]}</div>
                    )}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password" className="text-white">Password</Label>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        required 
                        className="bg-white/30 text-white placeholder:text-white"/>
                    {errors.password && (
                        <div className="text-red-500 text-sm mt-2">{errors.password[0]}</div>
                    )}
                </div>
                <Button type="submit" className="w-full bg-blue-400 hover:cursor-pointer">
                    {loading ? <Loader2 className="animate-spin"> Logging In </Loader2> : "Login"}
                </Button>
                </div>
                <div className="mt-4 text-center text-sm text-white">
                    Belum punya akun?{" "}
                    <a href="/register" className="underline underline-offset-4">
                        Register
                    </a>
                </div>
            </form>
        </CardContent>
    </Card>
  );
};

export default FormLogin;
