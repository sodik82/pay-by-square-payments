import { useState, useCallback } from "react";
import { decode, type DataModel } from "bysquare";
import { ImageDropZone } from "./components/ImageDropZone";
import { PaymentInfo } from "./components/PaymentInfo";
import { SepaExport } from "./components/SepaExport";
import { useQRScanner } from "./hooks/useQRScanner";

function App() {
  const { error: scanError, isLoading, scanImage, reset: resetScanner } = useQRScanner();
  const [paymentData, setPaymentData] = useState<DataModel | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [qrRawData, setQrRawData] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleQRResult = useCallback((qrData: string | null) => {
    setQrRawData(qrData);
    if (qrData) {
      try {
        const decoded = decode(qrData);
        console.log("Qr data decoded", decoded);
        setPaymentData(decoded);
        setDecodeError(null);
      } catch (err) {
        setPaymentData(null);
        setDecodeError(
          err instanceof Error
            ? err.message
            : "Failed to decode Pay by Square data"
        );
      }
    } else {
      setPaymentData(null);
      setDecodeError(null);
    }
  }, []);

  const handleImageSelect = useCallback(
    (file: File) => {
      setPaymentData(null);
      setDecodeError(null);
      setQrRawData(null);

      // Create URL for image preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      scanImage(file, handleQRResult);
    },
    [scanImage, handleQRResult]
  );

  const handleReset = useCallback(() => {
    resetScanner();
    setPaymentData(null);
    setDecodeError(null);
    setQrRawData(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
  }, [resetScanner, imageUrl]);

  const error = scanError || decodeError;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            PAY by Square Payments
          </h1>
          <p className="mt-2 text-gray-600">
            Upload an image with a Pay by Square QR code to decode payment info and (optionally) generate XML import file for your bank
          </p>
        </header>

        <div className="space-y-6">
          <ImageDropZone
            onImageSelect={handleImageSelect}
            imageUrl={imageUrl}
            onClear={handleReset}
          />

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <span className="ml-3 text-gray-600">Scanning QR code...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-medium text-red-700">Error</p>
              </div>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {paymentData && <PaymentInfo data={paymentData} />}

          {paymentData && paymentData.payments[0] && (
            <SepaExport payment={paymentData.payments[0]} />
          )}

          {qrRawData && !paymentData && !decodeError && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700">
                QR code found but it doesn&apos;t appear to be a Pay by Square
                format.
              </p>
              <p className="mt-2 break-all font-mono text-xs text-yellow-600">
                {qrRawData}
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Uses{" "}
            <a
              href="https://github.com/cozmo/jsQR"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              jsQR
            </a>
            ,{" "}
            <a
              href="https://github.com/xseman/bysquare"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              bysquare
            </a>
             {" "}and{" "}
            <a
              href="https://github.com/kewisch/sepa.js"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              sepa.js
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Use at your own risk. Verify payment details after importing.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
