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

type DonationContextValue = {
  openDonation: () => void;
  closeDonation: () => void;
  isOpen: boolean;
};

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDonation = useCallback(() => setIsOpen(true), []);
  const closeDonation = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openDonation, closeDonation, isOpen }),
    [openDonation, closeDonation, isOpen]
  );

  return (
    <DonationContext.Provider value={value}>
      {children}
      <DonationModal open={isOpen} onClose={closeDonation} />
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used within DonationProvider");
  return ctx;
}
