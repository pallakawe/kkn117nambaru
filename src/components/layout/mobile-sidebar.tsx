"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";

interface MobileSidebarProps {
    role?: string;
}

export function MobileSidebar({ role = "divisi" }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[90] bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`
                fixed left-0 top-0 z-[100] h-full w-72 transform transition-transform duration-300 ease-in-out md:hidden
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="relative h-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10 h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <Sidebar role={role} onNavigate={() => setIsOpen(false)} />
                </div>
            </div>
        </>
    );
}
