import { ActivityForm } from "@/components/activities/activity-form";

export default function NewActivityPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-outfit text-primary">Tambah Kegiatan</h2>
                <p className="text-muted-foreground">Dokumentasikan kegiatan divisi Anda hari ini.</p>
            </div>

            <ActivityForm />
        </div>
    );
}
