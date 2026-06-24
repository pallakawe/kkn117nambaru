import { createClient } from "@/lib/supabase/client";

export async function getActivities() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("activities")
        .select("*, pic:profiles(full_name)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function createActivity(activity: any) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    // Jika divisi sudah ada di objek activity (dikirim dari form), gunakan itu.
    // Jika tidak ada, baru ambil dari profil auth user (untuk Admin).
    let finalDivision = activity.division;

    if (!finalDivision) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("division")
            .eq("id", user.id)
            .single();
        finalDivision = profile?.division;
    }

    const { data, error } = await supabase
        .from("activities")
        .insert([{
            ...activity,
            division: finalDivision,
            created_by: user.id
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateActivity(id: string, activity: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("activities")
        .update(activity)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteActivity(id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

    if (error) throw error;
}
