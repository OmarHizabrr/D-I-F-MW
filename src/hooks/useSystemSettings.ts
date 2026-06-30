"use client";

import { useEffect, useState } from "react";
import { getSystemSettings } from "@/services/settingsService";
import type { SystemSettings } from "@/types/project-management";

const DEFAULTS: SystemSettings = {
  id: "global",
  organizationName: "مؤسسة D.I.F",
  defaultCurrency: "USD",
  enableDonorPortal: true,
  enableNotifications: true,
};

let cache: SystemSettings | null = null;
let loadPromise: Promise<SystemSettings> | null = null;

function loadSettings(): Promise<SystemSettings> {
  if (cache) return Promise.resolve(cache);
  if (!loadPromise) {
    loadPromise = getSystemSettings()
      .then((s) => {
        cache = { ...DEFAULTS, ...s };
        return cache;
      })
      .catch(() => DEFAULTS);
  }
  return loadPromise;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>(cache ?? DEFAULTS);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((s) => {
      if (!cancelled) {
        setSettings(s);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading, portalEnabled: settings.enableDonorPortal !== false };
}

export function invalidateSystemSettingsCache() {
  cache = null;
  loadPromise = null;
}
