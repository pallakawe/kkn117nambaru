"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createActivity } from "@/services/activities";
import { PICS_BY_DIVISION, Division } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ActivityForm() {
    const [loading, setLoading] = useState(false);
    const [division, setDivision] = useState<Division | null>(null);
    const [pics, setPics] = useState<string[]>([]);
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        day: "",
        time: "",
        activity_name: "",
        location: "",
        description: "",
        constraints: "",
        pic_id: "", // This should be the UUID from profiles table
    });

    // For simplicity path, we'll fetch profiles matching PICS names later
    // For now, we'll simulate PIC selection with names and resolve to UUID
    const [selectedPicName, setSelectedPicName] = useState("");
    const [availableProfiles, setAvailableProfiles] = useState<any[]>([]);

    useEffect(() => {
        async function getProfile() {
            // Cek apakah login via PIN (Anggota)
            const localProfileId = localStorage.getItem("posko_profile_id");
            const localProfileName = localStorage.getItem("posko_profile_name");

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("id, full_name, division")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setDivision(profile.division as Division);
                    setPics(PICS_BY_DIVISION[profile.division as Division] || []);

                    // Ambil daftar profil untuk dropdown (Hapus filter email agar semua PIC terbaca)
                    const { data: profiles } = await supabase
                        .from("profiles")
                        .select("id, full_name");
                    setAvailableProfiles(profiles || []);

                    // Jika login via PIN, otomatis set PIC ke dirinya sendiri
                    if (localProfileId && localProfileName) {
                        const localDivision = localStorage.getItem("posko_profile_division") as Division;
                        if (localDivision) {
                            setDivision(localDivision);
                            setPics(PICS_BY_DIVISION[localDivision] || []);
                        }

                        setSelectedPicName(localProfileName);
                        setFormData(prev => ({ ...prev, pic_id: localProfileId }));
                    }
                }
            }
        }
        getProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Jika login via PIN, kita sudah punya ID pastinya di localStorage
            const localProfileId = localStorage.getItem("posko_profile_id");
            let finalPicId = "";

            if (localProfileId) {
                finalPicId = localProfileId;
            } else {
                // Jika login Admin/Biasa, cari berdasarkan nama yang dipilih
                const picProfile = availableProfiles.find(p => p.full_name === selectedPicName);
                if (!picProfile) {
                    toast.error("PIC tidak valid");
                    setLoading(false);
                    return;
                }
                finalPicId = picProfile.id;
            }

            await createActivity({
                ...formData,
                division, // Pastikan divisi dari state dikirim ke database
                pic_id: finalPicId,
            });

            toast.success("Kegiatan berhasil ditambahkan");
            router.push("/dashboard/activities");
            router.refresh();
        } catch (error) {
            toast.error("Gagal menambahkan kegiatan");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard/activities">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h3 className="text-xl font-bold text-primary font-outfit">Input Kegiatan Baru</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                        id="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="day">Hari</Label>
                    <Input
                        id="day"
                        placeholder="Contoh: Senin"
                        required
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="time">Jam</Label>
                    <Input
                        id="time"
                        placeholder="08:00 - 10:00"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pic">Pelaksana (PIC)</Label>
                    <Select
                        onValueChange={setSelectedPicName}
                        value={selectedPicName}
                        disabled={!!localStorage.getItem("posko_profile_id")}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih PIC" />
                        </SelectTrigger>
                        <SelectContent>
                            {pics.map((pic) => (
                                <SelectItem key={pic} value={pic}>{pic}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activity_name">Nama Kegiatan</Label>
                <Input
                    id="activity_name"
                    placeholder="Nama kegiatan utama"
                    required
                    value={formData.activity_name}
                    onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                    id="location"
                    placeholder="Lokasi kegiatan"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Uraian Kegiatan</Label>
                <Textarea
                    id="description"
                    placeholder="Jelaskan detail kegiatan yang dilakukan..."
                    className="min-h-[120px]"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="constraints">Kendala (Opsional)</Label>
                <Textarea
                    id="constraints"
                    placeholder="Isi jika terdapat kendala selama kegiatan..."
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                />
            </div>


            <Button type="submit" className="w-full bg-primary py-6" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Simpan Kegiatan"}
            </Button>
        </form>
    );
}
