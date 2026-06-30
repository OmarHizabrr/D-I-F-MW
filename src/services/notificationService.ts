import { getDocs, query, where, orderBy } from "firebase/firestore";
import FirestoreApi from "@/services/firestoreApi";
import { getSystemSettings } from "@/services/settingsService";
import type { AppNotification } from "@/types/project-management";

const api = FirestoreApi.Api;

export type SendNotificationInput = {
  userId: string;
  title: string;
  body: string;
  type: AppNotification["type"];
  projectId?: string;
  groupId?: string;
};

export async function sendNotification(input: SendNotificationInput): Promise<string | null> {
  const settings = await getSystemSettings();
  if (!settings.enableNotifications) return null;

  const id = api.getNewId("notification");
  await api.setData({
    docRef: api.getNotificationDoc(id),
    data: {
      id,
      userId: input.userId,
      title: input.title,
      body: input.body,
      type: input.type,
      projectId: input.projectId ?? "",
      groupId: input.groupId ?? "",
      read: false,
      createdAt: new Date().toISOString(),
    },
    merge: false,
    userData: {},
  });
  return id;
}

export async function listUserNotifications(userId: string): Promise<AppNotification[]> {
  const q = query(
    api.getNotificationsCollection(),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => api.docToData<AppNotification>(d));
}

export async function listAllNotifications(): Promise<AppNotification[]> {
  const snap = await getDocs(api.getNotificationsCollection());
  return snap.docs
    .map((d) => api.docToData<AppNotification>(d))
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await api.updateData({
    docRef: api.getNotificationDoc(notificationId),
    data: { read: true },
    userData: {},
  });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await api.deleteData(api.getNotificationDoc(notificationId));
}
