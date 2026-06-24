"use client";

import { User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar({ userName: initialUserName, userRole = "divisi" }: { userName: string; userRole?: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [displayName, setDisplayName] = useState(initialUserName);
    const [roleLabel, setRoleLabel] = useState("Divisi");

    useEffect(() => {
        const localName = localStorage.getItem("posko_profile_name");
        const localDivision = localStorage.getItem("posko_profile_division");

        if (localName) {
            setDisplayName(localName);
            setRoleLabel(localDivision || "Pengurus Posko");
        } else {
            setDisplayName(initialUserName);
        }
    }, [initialUserName]);

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

    return (
        <div className="flex items-center p-4 bg-white md:bg-white/80 md:backdrop-blur-md border-b sticky top-0 z-10">
            <div className="flex w-full items-center justify-between md:justify-end">
                {/* Mobile: hamburger + title */}
                <div className="flex items-center gap-3 md:hidden">
                    <MobileSidebar role={userRole} />
                    <span className="font-bold font-outfit text-primary text-base">KKN 117 Nambaru</span>
                </div>

                {/* Avatar Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 p-0 overflow-hidden">
                            <User className="h-5 w-5 text-slate-600" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {roleLabel}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
