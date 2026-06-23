"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateActivity } from "@/services/activities";
import { VERIFICATION_STATUS } from "@/lib/constants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VerificationDialogProps {
    activity: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function VerificationDialog({ activity, isOpen, onClose, onSuccess }: VerificationDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        result: activity?.result || "",
        follow_up: activity?.follow_up || "",
        verification_status: activity?.verification_status || "Belum Diverifikasi",
    });

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateActivity(activity.id, formData);
            toast.success("Verifikasi berhasil disimpan");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error("Gagal menyimpan verifikasi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-primary font-outfit text-xl">Verifikasi Kegiatan</DialogTitle>
                    <DialogDescription>
                        Input hasil evaluasi dan tentukan status verifikasi kegiatan ini.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nama Kegiatan</Label>
                        <div className="p-3 bg-slate-50 rounded-lg text-sm font-medium">
                            {activity?.activity_name}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status Verifikasi</Label>
                        <Select
                            value={formData.verification_status}
                            onValueChange={(v) => setFormData({ ...formData, verification_status: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {VERIFICATION_STATUS.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="result">Hasil Evaluasi</Label>
                        <Textarea
                            id="result"
                            placeholder="Hasil dari kegiatan atau evaluasi..."
                            value={formData.result}
                            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="follow_up">Tindak Lanjut</Label>
                        <Textarea
                            id="follow_up"
                            placeholder="Langkah selanjutnya setelah kegiatan ini..."
                            value={formData.follow_up}
                            onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
                    <Button className="bg-primary" onClick={handleUpdate} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Simpan Perubahan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
