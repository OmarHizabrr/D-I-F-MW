import FirestoreApi from "@/services/firestoreApi";
import { isFirebaseConfigured } from "@/lib/firebase/client";

const api = FirestoreApi.Api;

export async function submitVolunteerApplication(data: {
  name: string;
  email: string;
  phone: string;
  opportunityId: string;
  opportunityTitle: string;
  message: string;
}): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;

  const id = api.getNewId("volunteer_applications");
  await api.setData({
    docRef: api.getVolunteerApplicationDoc(id),
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

export async function markVolunteerApplicationRead(id: string) {
  await api.updateData({
    docRef: api.getVolunteerApplicationDoc(id),
    data: { read: true },
  });
}

export async function deleteVolunteerApplication(id: string) {
  await api.deleteData(api.getVolunteerApplicationDoc(id));
}
