"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@/components/ui/Spinner";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { Download, Save, Trash2, Pencil, type LucideIcon } from "lucide-react";

export type LoadingAction = "load" | "save" | "delete" | "update";

type LoadingState = {
  open: boolean;
  action: LoadingAction;
  message?: string;
};

type LoadingContextValue = {
  isLoading: boolean;
  action: LoadingAction | null;
  showLoading: (action?: LoadingAction, message?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(
    fn: () => Promise<T>,
    action?: LoadingAction,
    message?: string
  ) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

const actionIcons: Record<LoadingAction, LucideIcon> = {
  load: Download,
  save: Save,
  delete: Trash2,
  update: Pencil,
};

function LoadingOverlayPanel({
  action,
  message,
}: {
  action: LoadingAction;
  message?: string;
}) {
  const { t } = useLocale();
  const ActionIcon = actionIcons[action];
  const label = message ?? t.loading[action];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div
        className={cn(
          "relative z-10 flex w-full max-w-xs flex-col items-center gap-5",
          "rounded-3xl border border-border-subtle bg-surface px-8 py-10 shadow-2xl sm:max-w-sm"
        )}
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-green/10">
          <ActionIcon
            className="absolute h-7 w-7 text-brand-green/25"
            strokeWidth={1.5}
          />
          <Spinner size="lg" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">{label}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t.loading.pleaseWait}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-brand-green" />
        </div>
      </div>
    </div>
  );
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoadingState>({
    open: false,
    action: "load",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = state.open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.open]);

  const showLoading = useCallback(
    (action: LoadingAction = "load", message?: string) => {
      setState({ open: true, action, message });
    },
    []
  );

  const hideLoading = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const withLoading = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      action: LoadingAction = "load",
      message?: string
    ): Promise<T> => {
      showLoading(action, message);
      try {
        return await fn();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  const value = useMemo(
    () => ({
      isLoading: state.open,
      action: state.open ? state.action : null,
      showLoading,
      hideLoading,
      withLoading,
    }),
    [state, showLoading, hideLoading, withLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {mounted &&
        state.open &&
        createPortal(
          <LoadingOverlayPanel action={state.action} message={state.message} />,
          document.body
        )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}
