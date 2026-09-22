"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({
  email,
  displayName: initialName,
  homeCity: initialCity,
}: {
  email: string;
  displayName: string;
  homeCity: string;
}) {
  const [displayName, setDisplayName] = useState(initialName);
  const [homeCity, setHomeCity] = useState(initialCity);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, home_city: homeCity }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      router.refresh();
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-gray-900">Profile</h2>

        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Display name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#BB00FF]"
        />

        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Home city
        </label>
        <input
          type="text"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
          placeholder="e.g. Houston, TX"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#BB00FF]"
        />
      </section>

      {/* Account */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-gray-900">Account</h2>

        <label className="mb-1 block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-400">
          Email can&apos;t be changed here yet.
        </p>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </div>
  );
}