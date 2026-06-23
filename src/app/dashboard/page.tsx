import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";
import { ActivityList } from "@/components/activities/activity-list";

export default async function DashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch real stats
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, division")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === "admin";

    const { count: totalActivities } = await supabase
        .from("activities")
        .select("*", { count: 'exact', head: true });

    const { count: todayActivities } = await supabase
        .from("activities")
        .select("*", { count: 'exact', head: true })
        .gte("date", new Date().toISOString().split("T")[0]);

    const { count: pendingVerification } = await supabase
        .from("activities")
        .select("*", { count: 'exact', head: true })
        .eq("verification_status", "Belum Diverifikasi");

    const { count: verifiedActivities } = await supabase
        .from("activities")
        .select("*", { count: 'exact', head: true })
        .eq("verification_status", "Terverifikasi");

    const stats = [
        {
            title: "Total Kegiatan",
            value: totalActivities || "0",
            icon: Activity,
            description: "Seluruh kegiatan terdaftar",
        },
        {
            title: "Hari Ini",
            value: todayActivities || "0",
            icon: Clock,
            description: "Kegiatan baru hari ini",
        },
        {
            title: isAdmin ? "Butuh Verifikasi" : "Terverifikasi",
            value: isAdmin ? (pendingVerification || "0") : (verifiedActivities || "0"),
            icon: isAdmin ? AlertCircle : CheckCircle2,
            description: isAdmin ? "Menunggu evaluasi Anda" : "Data resmi posko",
            color: isAdmin && pendingVerification ? "text-amber-500" : "text-muted-foreground"
        },
        {
            title: "Divisi",
            value: isAdmin ? "5" : profile?.division,
            icon: Users,
            description: isAdmin ? "Total divisi aktif" : "Divisi Anda",
        },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-outfit text-primary">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Selamat data kembali, {profile?.role === 'admin' ? 'Admin' : 'Rekan'}!
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-12 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityList role={profile?.role} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
