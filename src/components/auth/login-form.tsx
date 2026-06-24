"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ShieldCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// KONFIGURASI LOGIN PIN
const PIN_RAHASIA = "123456";
const SHARED_MEMBER_EMAIL = "tim@kkn117.com";
const SHARED_MEMBER_PASS = "posko123";

export function LoginForm() {
    const [mode, setMode] = useState<"admin" | "member">("admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedProfileId, setSelectedProfileId] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);

    const router = useRouter();
    const supabase = createClient();

    // Ambil daftar user untuk login PIN
    useEffect(() => {
        async function fetchProfiles() {
            const { data } = await supabase
                .from("profiles")
                .select("id, full_name, division")
                .neq("full_name", "Anggota Tim KKN") // Sembunyikan akun sistem
                .order("full_name");
            if (data) setProfiles(data);
        }
        fetchProfiles();
    }, []);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error("Gagal Login", { description: error.message });
                return;
            }

            localStorage.removeItem("posko_profile_id");
            localStorage.removeItem("posko_profile_name");

            toast.success("Login Admin Berhasil");
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setLoading(false);
        }
    };

    const handleMemberLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProfileId) {
            toast.error("Pilih nama Anda terlebih dahulu");
            return;
        }

        if (pin.trim() !== PIN_RAHASIA) {
            toast.error("PIN Salah", { description: "Silakan tanya Admin untuk PIN yang benar" });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: SHARED_MEMBER_EMAIL,
                password: SHARED_MEMBER_PASS,
            });

            if (error) {
                toast.error("Gagal Akses", { description: error.message });
                setLoading(false);
                return;
            }

            const profile = profiles.find(p => p.id === selectedProfileId);
            const cookieOptions = "; path=/; max-age=86400; SameSite=Lax";

            localStorage.setItem("posko_profile_id", selectedProfileId);
            localStorage.setItem("posko_profile_name", profile?.full_name || "");
            localStorage.setItem("posko_profile_division", profile?.division || "");

            document.cookie = `posko_profile_id=${selectedProfileId}${cookieOptions}`;
            document.cookie = `posko_profile_name=${encodeURIComponent(profile?.full_name || "")}${cookieOptions}`;
            document.cookie = `posko_profile_division=${encodeURIComponent(profile?.division || "")}${cookieOptions}`;

            toast.success(`Selamat bekerja, ${profile?.full_name}!`);
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
                <div className="flex w-full bg-slate-50 border-b">
                    <button
                        onClick={() => setMode("admin")}
                        className={cn(
                            "flex-1 flex items-center justify-center py-4 text-sm font-semibold transition-all",
                            mode === "admin" ? "bg-white text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin
                    </button>
                    <button
                        onClick={() => setMode("member")}
                        className={cn(
                            "flex-1 flex items-center justify-center py-4 text-sm font-semibold transition-all",
                            mode === "member" ? "bg-white text-primary border-b-2 border-primary" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Pengurus
                    </button>
                </div>

                <CardHeader className="space-y-1 text-center pt-8">
                    <CardTitle className="text-3xl font-bold font-outfit text-primary">KKN 117 NAMBARU</CardTitle>
                    <CardDescription className="text-slate-500">
                        {mode === "admin"
                            ? "Login khusus Sekretaris"
                            : "Akses cepat Anggota Divisi (Pakai PIN)"}
                    </CardDescription>
                </CardHeader>

                {mode === "admin" ? (
                    <form onSubmit={handleAdminLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@posko.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl border-slate-200 h-12"
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
                                    className="rounded-xl border-slate-200 h-12"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="pb-8">
                            <Button
                                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-7 shadow-lg shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Masuk sebagai Admin"}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <form onSubmit={handleMemberLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Pilih Nama Anda</Label>
                                <Select onValueChange={setSelectedProfileId} required>
                                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                                        <SelectValue placeholder="Cari nama..." />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {profiles.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.full_name} ({p.division})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pin">PIN Posko</Label>
                                <Input
                                    id="pin"
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="******"
                                    required
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="rounded-xl border-slate-200 h-12"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="pb-8">
                            <Button
                                className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-7 shadow-lg shadow-primary/20"
                                disabled={loading || !selectedProfileId}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Akses Sistem"}
                            </Button>
                        </CardFooter>
                    </form>
                )}
            </Card>

            {/* Panduan Penggunaan Section */}
            <Card className="w-full max-w-md mt-6 border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200 text-left">
                <CardHeader className="pb-3 px-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Loader2 className="w-4 h-4 text-primary animate-pulse" />
                        </div>
                        <CardTitle className="text-lg font-bold font-outfit">Panduan & Alur Sistem</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-none w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                            <div className="text-sm">
                                <p className="font-semibold text-slate-800">Akses Masuk</p>
                                <p className="text-slate-600 leading-relaxed">Pilih <b>Tab Pengurus</b>, cari nama Anda di daftar, dan masukkan <b>PIN Posko</b> (Tanya Sekretaris jika lupa).</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-none w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                            <div className="text-sm">
                                <p className="font-semibold text-slate-800">Catat Logbook</p>
                                <p className="text-slate-600 leading-relaxed">Klik menu <b>"Tambah Kegiatan"</b> di dashboard. Isi uraian kegiatan harian Anda dengan lengkap.</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-none w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                            <div className="text-sm">
                                <p className="font-semibold text-slate-800">Verifikasi Admin</p>
                                <p className="text-slate-600 leading-relaxed">Kegiatan Anda akan muncul di <b>"Daftar Kegiatan"</b>. Sekretaris akan mengecek dan memverifikasi laporan Anda.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100/50 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed italic">
                            "Laporan ini digunakan untuk bukti fisik penarikan KKN. Pastikan mengisi setiap hari agar tidak menumpuk di akhir."
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
