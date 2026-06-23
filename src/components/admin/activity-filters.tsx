"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIVISIONS, VERIFICATION_STATUS } from "@/lib/constants";
import { Search } from "lucide-react";

interface ActivityFiltersProps {
    onSearchChange: (value: string) => void;
    onDivisionChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export function ActivityFilters({ onSearchChange, onDivisionChange, onStatusChange }: ActivityFiltersProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Cari kegiatan..."
                    className="pl-10 rounded-xl"
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <Select onValueChange={onDivisionChange}>
                <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Semua Divisi" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Divisi</SelectItem>
                    {DIVISIONS.map(div => (
                        <SelectItem key={div} value={div}>{div}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={onStatusChange}>
                <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    {VERIFICATION_STATUS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="date"
                className="rounded-xl"
                onChange={(e) => onSearchChange(e.target.value)} // Simplified date search
            />
        </div>
    );
}
