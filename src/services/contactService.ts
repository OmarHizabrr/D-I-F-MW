import FirestoreApi from "@/services/firestoreApi";
import { isFirebaseConfigured } from "@/lib/firebase/client";

const api = FirestoreApi.Api;

export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const id = api.getNewId("contact_messages");
  await api.setData({
    docRef: api.getContactMessageDoc(id),
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

export async function markContactMessageRead(id: string) {
  await api.updateData({
    docRef: api.getContactMessageDoc(id),
    data: { read: true },
  });
}

export async function deleteContactMessage(id: string) {
  await api.deleteData(api.getContactMessageDoc(id));
}
