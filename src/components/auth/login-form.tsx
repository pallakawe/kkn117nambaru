"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error("Gagal Login", {
                    description: error.message,
                });
                return;
            }

            toast.success("Login Berhasil", {
                description: "Selamat datang di Sistem Administrasi KKN 117",
            });

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold font-outfit text-primary">KKN 117</CardTitle>
                <CardDescription className="text-gray-500">
                    Silakan masuk untuk akses administrasi posko
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@contoh.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold py-6"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Masuk...
                            </>
                        ) : (
                            "Masuk ke Sistem"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
