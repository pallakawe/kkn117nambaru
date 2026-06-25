"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Users, Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DivisionStatsDialogProps {
    data: Record<string, number>;
    isOpen: boolean;
    onClose: () => void;
}

export function DivisionStatsDialog({ data, isOpen, onClose }: DivisionStatsDialogProps) {
    // Ubah ke array dan urutkan
    const sortedStats = Object.entries(data)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const maxCount = Math.max(...Object.values(data), 1);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-outfit">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Peringkat Keaktifan Divisi
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {sortedStats.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Belum ada kegiatan tercatat.</p>
                    ) : (
                        sortedStats.map((stat, index) => (
                            <div key={stat.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {index === 0 ? <Award className="h-4 w-4" /> : index + 1}
                                        </div>
                                        <span className="font-semibold text-slate-700">{stat.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">{stat.count} Kegiatan</span>
                                </div>
                                <Progress
                                    value={(stat.count / maxCount) * 100}
                                    className="h-2 bg-slate-100"
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Data ini menunjukkan jumlah total logbook yang telah dikirimkan oleh masing-masing divisi.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
