import { getAdminAuth } from "@/lib/firebase/admin";
import { verifySuperAdmin, unauthorizedResponse } from "@/lib/api/verify-superadmin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uid: string }> }
) {
  const actor = await verifySuperAdmin(request);
  if (!actor) return unauthorizedResponse();

  const { uid } = await params;
  const body = (await request.json()) as { password?: string };

  if (!body.password || body.password.length < 6) {
    return Response.json(
      { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
      { status: 400 }
    );
  }

  try {
    await getAdminAuth().updateUser(uid, { password: body.password });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل تغيير كلمة المرور";
    return Response.json({ error: message }, { status: 400 });
  }

  return Response.json({ ok: true });
}
