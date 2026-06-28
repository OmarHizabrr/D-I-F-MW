import FirestoreApi from "@/services/firestoreApi";
import { getDefaultNavItems } from "@/data/default-content";
import type { UserMeta } from "@/services/firestoreApi";

const api = FirestoreApi.Api;

export async function restoreDefaultNavItems(userData: UserMeta = {}) {
  for (const item of getDefaultNavItems()) {
    await api.setData({
      docRef: api.getNavItemDoc(item.id),
      data: item,
      userData,
    });
  }
}
