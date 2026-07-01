import { verifyPortalSession } from "@/lib/portal/portal-session-server";
import { resolveDonorProjects } from "@/lib/portal/portal-projects-server";

export async function GET(request: Request) {
  const sessionToken = request.headers.get("x-portal-session");
  const donorId = await verifyPortalSession(sessionToken);
  if (!donorId) {
    return Response.json({ error: "جلسة غير صالحة" }, { status: 401 });
  }

  const projects = await resolveDonorProjects(donorId);
  return Response.json({ projects });
}
