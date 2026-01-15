import { useState, useCallback } from "react";
import jsQR from "jsqr";

interface ScanState {
  error: string | null;
  isLoading: boolean;
}

export function useQRScanner() {
  const [state, setState] = useState<ScanState>({
    error: null,
    isLoading: false,
  });

  const scanImage = useCallback(
    (file: File, onResult: (data: string | null) => void) => {
      setState({ error: null, isLoading: true });

      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            setState({
              error: "Could not get canvas context",
              isLoading: false,
            });
            onResult(null);
            return;
          }

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setState({ error: null, isLoading: false });
            onResult(code.data);
          } else {
            setState({
              error: "No QR code found in image",
              isLoading: false,
            });
            onResult(null);
          }
        };

        img.onerror = () => {
          setState({
            error: "Failed to load image",
            isLoading: false,
          });
          onResult(null);
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        setState({
          error: "Failed to read file",
          isLoading: false,
        });
        onResult(null);
      };

      reader.readAsDataURL(file);
    },
    []
  );

  const reset = useCallback(() => {
    setState({ error: null, isLoading: false });
  }, []);

  return { ...state, scanImage, reset };
}
