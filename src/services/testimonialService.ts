import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import { setUserBanned } from "@/services/userService";
import type { TestimonialItem } from "@/types/cms";
import { emptyLocalized } from "@/types/cms";

const api = FirestoreApi.Api;

export async function submitPublicTestimonial(params: {
  userId: string;
  displayName: string;
  photoURL: string;
  quote: string;
  roleLabel?: string;
}) {
  const docs = await api.getOrderedDocuments(api.getTestimonialsCollection());
  const maxOrder = docs.reduce((max, d) => Math.max(max, (d.data().order as number) || 0), 0);
  const id = api.getNewId("testimonials");
  const name = { ar: params.displayName, en: params.displayName, ny: params.displayName };
  const roleText = params.roleLabel || "مستفيد";
  const role = { ar: roleText, en: roleText, ny: roleText };
  const quote = { ar: params.quote, en: params.quote, ny: params.quote };

  const payload: TestimonialItem = {
    id,
    name,
    role,
    quote,
    imageUrl: params.photoURL || "",
    youtubeUrl: "",
    enabled: false,
    order: maxOrder + 1,
    userId: params.userId,
    source: "public",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await api.setData({
    docRef: api.getTestimonialDoc(id),
    data: payload,
    merge: false,
    userData: { uid: params.userId, displayName: params.displayName, photoURL: params.photoURL },
  });

  return id;
}

export async function approveTestimonial(id: string, actor: UserMeta = {}) {
  await api.updateData({
    docRef: api.getTestimonialDoc(id),
    data: { status: "approved", enabled: true },
    userData: actor,
  });
}

export async function rejectTestimonial(id: string, actor: UserMeta = {}) {
  await api.deleteData(api.getTestimonialDoc(id));
}

export async function banTestimonialUser(userId: string, actor: UserMeta = {}) {
  await setUserBanned(userId, true, actor);
}

export function isTestimonialPublished(item: TestimonialItem): boolean {
  if (!item.enabled) return false;
  if (item.source === "public") return item.status === "approved";
  return item.status !== "pending" && item.status !== "rejected";
}

export function testimonialStatusLabel(item: TestimonialItem): string {
  if (item.status === "pending") return "بانتظار الموافقة";
  if (item.status === "rejected") return "مرفوض";
  if (item.enabled) return "منشور";
  return "مسودة";
}
