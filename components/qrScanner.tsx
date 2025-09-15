import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const QrScanner = ({ onScanSuccess, onScanFailure }: QrScannerProps) => {

  useEffect(() => {
    // Create a new scanner instance
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      {
        fps: 10, // Frames per second
        qrbox: { width: 250, height: 250 }, // The scanning box dimensions
        supportedScanTypes: [], // Use all supported scan types
      },
      false // Verbose logs
    );

    // Render the scanner
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // IMPORTANT: Cleanup function to stop the scanner when the component unmounts
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id={qrcodeRegionId} />;
};

export default QrScanner;