'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const QrScanner = ({ onScanSuccess, onScanFailure }: QrScannerProps) => {
  // Use a ref to store the scanner instance.
  // This prevents it from being recreated on every render and helps in cleanup.
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Create a new instance and store it in the ref
    const scanner = new Html5Qrcode(qrcodeRegionId);
    scannerInstanceRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    scanner.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      onScanFailure
    ).catch(error => {
      console.error("Failed to start the QR scanner.", error);
    });

    // This is the cleanup function
    return () => {
      // Ensure the scanner instance exists
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.stop().then(() => {
          console.log("Scanner stopped.");
          
          // --- THE CRITICAL FIX ---
          // Manually clear the inner HTML of the container.
          const container = document.getElementById(qrcodeRegionId);
          if (container) {
            container.innerHTML = '';
          }
          // --- END OF FIX ---

        }).catch(error => {
          console.error("Failed to stop the QR scanner.", error);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={qrcodeRegionId} style={{ width: '100%', minHeight: '300px' }} />;
};

export default QrScanner;