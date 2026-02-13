"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrDisplayProps {
  publicToken: string;
  jobNumber: string;
}

export function QrDisplay({ publicToken, jobNumber }: QrDisplayProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/repair/${publicToken}`);
  }, [publicToken]);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <QRCodeSVG value={url} size={200} />
      <p className="text-sm font-medium">{jobNumber}</p>
      <p className="text-xs text-muted-foreground break-all text-center max-w-[250px]">{url}</p>
    </div>
  );
}
