import { ActivityList } from "@/components/activities/activity-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-outfit text-primary">Daftar Kegiatan</h2>
                    <p className="text-muted-foreground">Kelola dan lihat seluruh dokumentasi kegiatan divisi Anda.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/activities/new">
                        <Button className="bg-primary rounded-xl">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
                        </Button>
                    </Link>
                </div>
            </div>

            <ActivityList />
        </div>
    );
}
