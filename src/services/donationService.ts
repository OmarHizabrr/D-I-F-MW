import FirestoreApi from "@/services/firestoreApi";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import type { DonationIntentRecord } from "@/types/cms";

const api = FirestoreApi.Api;

export async function submitDonationIntent(
  data: Omit<DonationIntentRecord, "id" | "read">
): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const id = api.getNewId("donation_intents");
  await api.setData({
    docRef: api.getDonationIntentDoc(id),
    data: {
      ...data,
      read: false,
      submittedAt: new Date().toISOString(),
    },
    merge: false,
    userData: {},
  });
  return id;
}
