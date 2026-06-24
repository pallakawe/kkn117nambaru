"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ClipboardList,
    PlusCircle,
    CheckSquare,
    Settings,
    LogOut,
    FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

const allRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-primary",
        roles: ["admin", "divisi"],
    },
    {
        label: "Daftar Kegiatan",
        icon: ClipboardList,
        href: "/dashboard/activities",
        color: "text-primary",
        roles: ["admin", "divisi"],
    },
    {
        label: "Tambah Kegiatan",
        icon: PlusCircle,
        href: "/dashboard/activities/new",
        color: "text-primary",
        roles: ["divisi"], // Hanya tampil untuk pengurus, bukan admin
    },
    {
        label: "Folder Drive",
        icon: FolderOpen,
        href: "https://drive.google.com/drive/folders/1IfSknxBacnJm6dYo4AuYKS4QEWqOx3Hq?usp=sharing",
        color: "text-blue-500",
        external: true,
        roles: ["admin", "divisi"],
    },
];

interface SidebarProps {
    role?: string;
    onNavigate?: () => void;
}

export function Sidebar({ role = "divisi", onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("posko_profile_id");
        localStorage.removeItem("posko_profile_name");
        localStorage.removeItem("posko_profile_division");
        document.cookie = "posko_profile_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "posko_profile_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "posko_profile_division=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
        router.refresh();
    };

    const routes = allRoutes.filter(r => r.roles.includes(role));

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r shadow-sm">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-10">
                    <div className="w-10 h-10 rounded-xl overflow-hidden mr-3 shadow-md">
                        <img src="/logo kkn.png" alt="Logo KKN 117" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-xl font-bold font-outfit text-slate-800">
                        KKN 117
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        const isExternal = 'external' in route && route.external;
                        const LinkComponent = isExternal ? 'a' : Link;
                        const linkProps = isExternal
                            ? { href: route.href, target: "_blank", rel: "noopener noreferrer" }
                            : { href: route.href };

                        return (
                            <LinkComponent
                                key={route.href}
                                {...linkProps as any}
                                onClick={() => onNavigate?.()}
                                className={cn(
                                    "text-sm group flex p-4 w-full justify-start font-medium cursor-pointer hover:bg-slate-50 rounded-xl transition-all",
                                    pathname === route.href ? "bg-slate-100 text-primary" : "text-slate-500"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </LinkComponent>
                        );
                    })}
                </div>
            </div>

            <div className="px-3 py-2">
                <Separator className="mb-4" />
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl p-4">
                    <LogOut className="h-5 w-5 mr-3" />
                    Keluar
                </Button>
            </div>
        </div>
    );
}
