import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Whitelist editable fields only
  const patch: Record<string, unknown> = {};
  if ("start_time" in body) patch.start_time = body.start_time;
  if ("note" in body) patch.note = body.note;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // Update — RLS ensures the user owns the trip this stop belongs to
  const { error } = await supabase
    .from("trip_places")
    .update(patch)
    .eq("id", stopId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ stopId: string }> }
) {
  const { stopId } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete — RLS ensures the user owns the trip this stop belongs to
  const { error } = await supabase
    .from("trip_places")
    .delete()
    .eq("id", stopId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}