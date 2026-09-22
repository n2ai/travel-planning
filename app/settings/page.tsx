import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, home_city")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#f4eddf] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/home" className="text-sm font-semibold text-[#BB00FF] hover:underline">
          ← Back to trips
        </Link>

        <h1 className="mb-6 mt-3 text-3xl font-black text-gray-900">
          Account settings
        </h1>

        <SettingsForm
          email={user.email ?? ""}
          displayName={profile?.display_name ?? ""}
          homeCity={profile?.home_city ?? ""}
        />
      </div>
    </main>
  );
}