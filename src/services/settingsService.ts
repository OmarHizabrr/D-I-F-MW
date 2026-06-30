import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import type { SystemSettings } from "@/types/project-management";

const api = FirestoreApi.Api;

const DEFAULT_SETTINGS: SystemSettings = {
  id: "global",
  organizationName: "مؤسسة D.I.F للتنمية والاستثمار",
  defaultCurrency: "USD",
  enableDonorPortal: true,
  enableNotifications: true,
};

export async function getSystemSettings(): Promise<SystemSettings> {
  const data = await api.getData(api.getSystemSettingsDoc());
  return data ? ({ ...DEFAULT_SETTINGS, ...data } as SystemSettings) : DEFAULT_SETTINGS;
}

export async function saveSystemSettings(
  settings: Partial<SystemSettings>,
  user: UserMeta
): Promise<void> {
  await api.setData({
    docRef: api.getSystemSettingsDoc(),
    data: {
      ...settings,
      id: "global",
      updatedAt: new Date().toISOString(),
    },
    userData: user,
  });
}
