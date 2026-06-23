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

    // Get user profile for division
    const { data: profile } = await supabase
        .from("profiles")
        .select("division")
        .eq("id", user.id)
        .single();

    const { data, error } = await supabase
        .from("activities")
        .insert([{
            ...activity,
            division: profile?.division,
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
