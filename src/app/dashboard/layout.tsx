import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const cookieStore = await cookies();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

    const guestName = cookieStore.get("posko_profile_name")?.value;
    const displayName = guestName ? decodeURIComponent(guestName) : (profile?.full_name || user.email || "Pengguna");
    const userRole = profile?.role || "divisi";

    return (
        <div className="h-full relative font-inter">
            {/* Sidebar Desktop */}
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900">
                <Sidebar role={userRole} />
            </div>

            <main className="md:pl-72 flex flex-col min-h-screen bg-slate-50">
                <Navbar userName={displayName} userRole={userRole} />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
