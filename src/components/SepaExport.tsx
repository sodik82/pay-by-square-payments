import { useState } from "react";
import type { Payment } from "bysquare";
import { DebtorInfoForm, useDebtorInfo } from "./DebtorInfoForm";
import {
  generateSepaXml,
  isDebtorInfoComplete,
} from "../utils/sepaGenerator";

interface SepaExportProps {
  payment: Payment;
}

function downloadXml(xml: string, filename: string): void {
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function SepaExport({ payment }: SepaExportProps) {
  const [debtorInfo, setDebtorInfo] = useDebtorInfo();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canExport = isDebtorInfoComplete(debtorInfo) && payment.amount;

  const handleExport = () => {
    setError(null);
    setSuccess(false);

    try {
      const xml = generateSepaXml(payment, debtorInfo);
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `sepa-payment-${timestamp}.xml`;
      downloadXml(xml, filename);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate SEPA XML"
      );
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">
          Export SEPA XML
        </h2>
      </div>

      <DebtorInfoForm value={debtorInfo} onChange={setDebtorInfo} />

      <div className="mt-6">
        <button
          onClick={handleExport}
          disabled={!canExport}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors ${
            canExport
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Generate SEPA XML (pain.001.001.03)
        </button>

        {!canExport && (
          <p className="mt-2 text-center text-sm text-gray-500">
            {!payment.amount
              ? "Payment amount is required"
              : "Please fill in all your bank details above"}
          </p>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-700">
            SEPA XML file downloaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
