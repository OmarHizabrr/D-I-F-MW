import { query, where, getDocs } from "firebase/firestore";
import FirestoreApi from "@/services/firestoreApi";
import { isFirebaseConfigured } from "@/lib/firebase/client";

const api = FirestoreApi.Api;

export async function subscribeNewsletter(email: string): Promise<"ok" | "duplicate" | "offline"> {
  if (!isFirebaseConfigured()) return "offline";

  const normalized = email.trim().toLowerCase();
  const col = api.getNewsletterSubscribersCollection();
  const existing = await getDocs(query(col, where("email", "==", normalized)));
  if (!existing.empty) return "duplicate";

  const id = api.getNewId("newsletter_subscribers");
  await api.setData({
    docRef: api.getNewsletterSubscriberDoc(id),
    data: {
      email: normalized,
      subscribedAt: new Date().toISOString(),
    },
    merge: false,
    userData: {},
  });
  return "ok";
}

export async function deleteNewsletterSubscriber(id: string) {
  await api.deleteData(api.getNewsletterSubscriberDoc(id));
}
