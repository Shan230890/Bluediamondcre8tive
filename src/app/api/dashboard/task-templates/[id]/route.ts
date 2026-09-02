import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Delete for a single saved task template. RLS-scoped, no admin client. */

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("task_templates").delete().eq("id", id).eq("client_id", user.id);
  if (error) {
    console.error("[task-templates] delete failed:", error);
    return NextResponse.json({ error: "Failed to delete template." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
