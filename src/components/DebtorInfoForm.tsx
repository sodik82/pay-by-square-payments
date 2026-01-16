import { useState } from "react";
import type { DebtorInfo } from "../utils/sepaGenerator";
import { isValidIBAN } from "../utils/sepaGenerator";

interface DebtorInfoFormProps {
  value: DebtorInfo;
  onChange: (info: DebtorInfo) => void;
}

export function DebtorInfoForm({ value, onChange }: DebtorInfoFormProps) {
  const [ibanTouched, setIbanTouched] = useState(false);

  const ibanValid = !value.iban.trim() || isValidIBAN(value.iban);
  const showIbanError = ibanTouched && value.iban.trim() && !ibanValid;

  const handleChange =
    (field: keyof DebtorInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Your Bank Details</h3>
      <p className="text-sm text-gray-500">
        Enter your bank account details. These will be saved for future use.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="debtor-iban"
            className="block text-sm font-medium text-gray-700"
          >
            Your IBAN
          </label>
          <input
            type="text"
            id="debtor-iban"
            value={value.iban}
            onChange={handleChange("iban")}
            onBlur={() => setIbanTouched(true)}
            placeholder="SK89 0200 0000 0000 0012 3456"
            className={`mt-1 block w-full rounded-md border px-3 py-2 font-mono shadow-sm focus:outline-none focus:ring-1 ${
              showIbanError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }`}
          />
          {showIbanError && (
            <p className="mt-1 text-sm text-red-600">Invalid IBAN format</p>
          )}
        </div>

        <div>
          <label
            htmlFor="debtor-bic"
            className="block text-sm font-medium text-gray-700"
          >
            Your BIC/SWIFT
          </label>
          <input
            type="text"
            id="debtor-bic"
            value={value.bic}
            onChange={handleChange("bic")}
            placeholder="SUBASKBX"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="debtor-name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name
          </label>
          <input
            type="text"
            id="debtor-name"
            value={value.name}
            onChange={handleChange("name")}
            placeholder="John Doe"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
