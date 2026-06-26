"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActivities } from "@/services/activities";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Edit, Trash2, Eye, ExternalLink, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { VerificationDialog } from "@/components/admin/verification-dialog";
import { ActivityFilters } from "@/components/admin/activity-filters";

export function ActivityList({ role = "divisi", userDivision }: { role?: string, userDivision?: string }) {
    const [activities, setActivities] = useState<any[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Filters State
    const [search, setSearch] = useState("");
    const [divisionFilter, setDivisionFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchActivities = async () => {
        try {
            const data = await getActivities();
            setActivities(data);
            setFilteredActivities(data);
        } catch (error) {
            toast.error("Gagal memuat data kegiatan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    useEffect(() => {
        let result = activities;

        if (search) {
            result = result.filter(a =>
                a.activity_name.toLowerCase().includes(search.toLowerCase()) ||
                a.location.toLowerCase().includes(search.toLowerCase()) ||
                a.date.includes(search)
            );
        }

        if (divisionFilter !== "all") {
            result = result.filter(a => a.division === divisionFilter);
        }

        if (statusFilter !== "all") {
            result = result.filter(a => a.verification_status === statusFilter);
        }

        // Filter berdasarkan divisi pengguna jika bukan admin
        if (role !== "admin" && userDivision) {
            result = result.filter(a => a.division?.toLowerCase() === userDivision.toLowerCase());
        }

        setFilteredActivities(result);
    }, [search, divisionFilter, statusFilter, activities]);

    const handleVerify = (activity: any) => {
        setSelectedActivity(activity);
        setIsVerifying(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) return;

        try {
            const { deleteActivity } = await import("@/services/activities");
            await deleteActivity(id);
            toast.success("Kegiatan berhasil dihapus");
            fetchActivities();
        } catch (error) {
            toast.error("Gagal menghapus kegiatan");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Terverifikasi":
                return "bg-green-100 text-green-700 hover:bg-green-100";
            case "Perlu Revisi":
                return "bg-amber-100 text-amber-700 hover:bg-amber-100";
            case "Belum Diverifikasi":
            default:
                return "bg-slate-100 text-slate-700 hover:bg-slate-100";
        }
    };

    if (loading) {
        return <div className="text-center py-10">Memuat kegiatan...</div>;
    }

    return (
        <div className="space-y-4 w-full">
            {role === "admin" && (
                <ActivityFilters
                    onSearchChange={setSearch}
                    onDivisionChange={setDivisionFilter}
                    onStatusChange={setStatusFilter}
                />
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Kegiatan</TableHead>
                            <TableHead>Divisi & PIC</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredActivities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Belum ada kegiatan yang ditemukan
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredActivities.map((activity) => (
                                <TableRow key={activity.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="font-medium">
                                            {format(new Date(activity.date), "dd MMMM yyyy", { locale: idLocale })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-slate-800">{activity.activity_name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {activity.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{activity.division}</div>
                                        <div className="text-xs text-muted-foreground">{activity.pic?.full_name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(activity.verification_status)}>
                                            {activity.verification_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {activity.documentation_link && (
                                                <a
                                                    href={activity.documentation_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-500"
                                                        title="Buka Dokumentasi"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            )}

                                            <Link href={`/dashboard/activities/${activity.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            {role === "admin" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-primary"
                                                        title="Verifikasi"
                                                        onClick={() => handleVerify(activity)}
                                                    >
                                                        <CheckSquare className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500"
                                                        title="Hapus"
                                                        onClick={() => handleDelete(activity.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {isVerifying && (
                <VerificationDialog
                    activity={selectedActivity}
                    isOpen={isVerifying}
                    onClose={() => setIsVerifying(false)}
                    onSuccess={fetchActivities}
                />
            )}
        </div>
    );
}
