import { supabase } from "@/integrations/supabase/client";

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  });
  if (error) console.error("Failed to create notification:", error);
}

export async function notifyAllAdmins({
  title,
  message,
  type = "info",
  link,
}: {
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  const { data: adminRoles } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  if (adminRoles && adminRoles.length > 0) {
    const notifications = adminRoles.map((r) => ({
      user_id: r.user_id,
      title,
      message,
      type,
      link,
    }));
    const { error } = await supabase.from("notifications").insert(notifications);
    if (error) console.error("Failed to notify admins:", error);
  }
}
