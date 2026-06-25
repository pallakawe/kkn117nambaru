"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DivisionStatsDialog } from "@/components/admin/division-stats-dialog";
import { cn } from "@/lib/utils";
import { Activity, Clock, Users, AlertCircle, CheckCircle2 } from "lucide-react";

const ICON_MAP: Record<string, any> = {
    Activity,
    Clock,
    Users,
    AlertCircle,
    CheckCircle2,
};

interface StatsGridProps {
    stats: any[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const divisionStat = stats.find(s => s.title === "Divisi");

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = ICON_MAP[stat.icon] || Activity;
                    return (
                        <Card
                            key={stat.title}
                            className={cn(
                                "transition-all border-none shadow-sm bg-white",
                                stat.isClickable ? "cursor-pointer hover:shadow-md hover:ring-2 hover:ring-primary/20" : ""
                            )}
                            onClick={() => {
                                if (stat.isClickable && stat.title === "Divisi") {
                                    setIsStatsOpen(true);
                                }
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                    {stat.isClickable && (
                                        <span className="block mt-1 text-primary font-semibold text-[10px]">Klik untuk detail →</span>
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {divisionStat && (
                <DivisionStatsDialog
                    data={divisionStat.data}
                    isOpen={isStatsOpen}
                    onClose={() => setIsStatsOpen(false)}
                />
            )}
        </>
    );
}
