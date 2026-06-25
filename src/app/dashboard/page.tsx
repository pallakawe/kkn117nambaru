import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, Clock, Users, AlertCircle } from "lucide-react";
import { ActivityList } from "@/components/activities/activity-list";
import { cookies } from "next/headers";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Division } from "@/lib/constants";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = await cookies();

    if (!user) {
        return redirect("/login");
    }

    // Fetch real stats
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, division")
        .eq("id", user.id)
        .single();

    // Override division if PIN login (detected via cookie)
    const guestDivision = cookieStore.get("posko_profile_division")?.value;
    const currentDivision = guestDivision ? decodeURIComponent(guestDivision) : profile?.division;

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

    const { data: divisionStats } = await supabase
        .from("activities")
        .select("division");

    // Hitung jumlah per divisi
    const activityCounts = divisionStats?.reduce((acc: any, curr: any) => {
        acc[curr.division] = (acc[curr.division] || 0) + 1;
        return acc;
    }, {}) || {};

    const stats = [
        {
            title: "Total Kegiatan",
            value: totalActivities || "0",
            icon: "Activity",
            description: "Seluruh kegiatan terdaftar",
        },
        {
            title: "Hari Ini",
            value: todayActivities || "0",
            icon: "Clock",
            description: "Kegiatan baru hari ini",
        },
        {
            title: isAdmin ? "Butuh Verifikasi" : "Terverifikasi",
            value: isAdmin ? (pendingVerification || "0") : (verifiedActivities || "0"),
            icon: isAdmin ? "AlertCircle" : "CheckCircle2",
            description: isAdmin ? "Menunggu evaluasi Anda" : "Data resmi posko",
            color: isAdmin && pendingVerification ? "text-amber-500" : "text-muted-foreground"
        },
        {
            title: "Divisi",
            value: isAdmin ? "5" : currentDivision,
            icon: "Users",
            description: isAdmin ? "Total divisi aktif" : "Divisi Anda",
            isClickable: isAdmin,
            data: activityCounts
        },
    ];

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-outfit text-primary">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Selamat data kembali, {profile?.role === 'admin' ? 'Admin' : 'Rekan'}!
                    </p>
                </div>
            </div>

            <StatsGrid stats={stats} />

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
