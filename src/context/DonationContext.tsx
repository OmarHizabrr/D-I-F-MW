"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DonationModal } from "@/components/donation/DonationModal";

export type DonationOpenOptions = {
  projectId?: string;
  projectName?: string;
  amount?: number;
  recurring?: boolean;
};

type DonationContextValue = {
  openDonation: (options?: DonationOpenOptions) => void;
  closeDonation: () => void;
  isOpen: boolean;
  options: DonationOpenOptions;
};

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DonationOpenOptions>({});

  const openDonation = useCallback((opts?: DonationOpenOptions) => {
    setOptions(opts ?? {});
    setIsOpen(true);
  }, []);
  const closeDonation = useCallback(() => {
    setIsOpen(false);
    setOptions({});
  }, []);

  const value = useMemo(
    () => ({ openDonation, closeDonation, isOpen, options }),
    [openDonation, closeDonation, isOpen, options]
  );

  return (
    <DonationContext.Provider value={value}>
      {children}
      <DonationModal open={isOpen} onClose={closeDonation} options={options} />
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used within DonationProvider");
  return ctx;
}
