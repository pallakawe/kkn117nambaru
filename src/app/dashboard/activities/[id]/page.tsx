import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, User, Users, CheckCircle2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: PageProps) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/login");

    const { data: activity, error } = await supabase
        .from("activities")
        .select("*, pic:profiles(full_name, division)")
        .eq("id", id)
        .single();

    if (!activity || error) return notFound();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Terverifikasi": return "bg-green-100 text-green-700";
            case "Perlu Revisi": return "bg-amber-100 text-amber-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/activities">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-outfit text-primary">Detail Kegiatan</h2>
                    <p className="text-muted-foreground text-sm">Informasi lengkap kegiatan divisi</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
                    <div>
                        <CardTitle className="text-xl">{activity.activity_name}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">{activity.location}</p>
                    </div>
                    <Badge className={getStatusColor(activity.verification_status)}>
                        {activity.verification_status}
                    </Badge>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    {/* Waktu & Tempat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <Calendar className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Tanggal</p>
                                <p className="font-medium text-sm">
                                    {activity.day}, {format(new Date(activity.date), "dd MMMM yyyy", { locale: idLocale })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <Clock className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Waktu</p>
                                <p className="font-medium text-sm">{activity.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Lokasi</p>
                                <p className="font-medium text-sm">{activity.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pelaksana */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <User className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">PIC</p>
                                <p className="font-medium text-sm">{activity.pic?.full_name || "-"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            <Users className="h-5 w-5 text-primary shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground">Divisi</p>
                                <p className="font-medium text-sm">{activity.division}</p>
                            </div>
                        </div>
                    </div>

                    {/* Uraian */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Uraian Kegiatan</h3>
                        </div>
                        <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                            {activity.description}
                        </p>
                    </div>

                    {/* Kendala */}
                    {activity.constraints && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <h3 className="font-semibold text-sm">Kendala</h3>
                            </div>
                            <p className="text-sm text-slate-700 bg-amber-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                                {activity.constraints}
                            </p>
                        </div>
                    )}

                    {/* Dokumentasi */}
                    {activity.documentation_link && (
                        <div className="space-y-2 border-t pt-4">
                            <h3 className="font-semibold text-sm">Dokumentasi</h3>
                            <a
                                href={activity.documentation_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium bg-primary/5 p-3 rounded-lg w-full md:w-auto transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Buka Link Google Drive / Foto
                            </a>
                        </div>
                    )}

                    {/* Hasil Verifikasi */}
                    {(activity.result || activity.follow_up) && (
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <h3 className="font-semibold text-sm">Catatan Verifikasi Admin</h3>
                            </div>
                            {activity.result && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Hasil</p>
                                    <p className="text-sm text-slate-700 bg-green-50 rounded-lg p-4 leading-relaxed">
                                        {activity.result}
                                    </p>
                                </div>
                            )}
                            {activity.follow_up && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Tindak Lanjut</p>
                                    <p className="text-sm text-slate-700 bg-blue-50 rounded-lg p-4 leading-relaxed">
                                        {activity.follow_up}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
