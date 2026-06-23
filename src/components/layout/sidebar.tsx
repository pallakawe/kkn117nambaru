"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-primary",
    },
    {
        label: "Daftar Kegiatan",
        icon: ClipboardList,
        href: "/dashboard/activities",
        color: "text-primary",
    },
    {
        label: "Tambah Kegiatan",
        icon: PlusCircle,
        href: "/dashboard/activities/new",
        color: "text-primary",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r shadow-sm">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-md shadow-primary/20">
                        <span className="text-white font-bold font-outfit">117</span>
                    </div>
                    <h1 className="text-xl font-bold font-outfit text-slate-800">
                        KKN 117
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-4 w-full justify-start font-medium cursor-pointer hover:bg-slate-50 rounded-xl transition-all",
                                pathname === route.href ? "bg-slate-100 text-primary" : "text-slate-500"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2">
                <Separator className="mb-4" />
                <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl p-4">
                    <LogOut className="h-5 w-5 mr-3" />
                    Keluar
                </Button>
            </div>
        </div>
    );
}
