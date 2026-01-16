import { useState } from "react";
import type { DebtorInfo } from "../utils/sepaGenerator";

const STORAGE_KEY = "sepa-debtor-info";

function loadFromStorage(): DebtorInfo {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { iban: "", bic: "", name: "" };
}

function saveToStorage(info: DebtorInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // Ignore storage errors
  }
}

export function useDebtorInfo() {
  const [debtorInfo, setDebtorInfo] = useState<DebtorInfo>(() =>
    loadFromStorage()
  );

  const updateDebtorInfo = (info: DebtorInfo) => {
    setDebtorInfo(info);
    saveToStorage(info);
  };

  return [debtorInfo, updateDebtorInfo] as const;
}
