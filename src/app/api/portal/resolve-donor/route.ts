import {
  authRequiredResponse,
  verifyAuthenticatedUser,
} from "@/lib/api/verify-authenticated";
import { resolveDonorForAuthUser } from "@/lib/server/donor-portal-server";

export async function POST(request: Request) {
  const auth = await verifyAuthenticatedUser(request);
  if (!auth) return authRequiredResponse();

  const result = await resolveDonorForAuthUser(
    auth.uid,
    auth.email,
    auth.token.name
  );

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({
    donor: result.donor,
    linked: result.linked,
  });
}
