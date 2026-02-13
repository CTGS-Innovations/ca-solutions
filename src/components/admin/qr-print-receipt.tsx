"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RepairTicket, Customer, Device } from "@/types";
import { formatDate } from "@/lib/utils";
import { contactInfo } from "@/data/site-content";

interface QrPrintReceiptProps {
  ticket: RepairTicket;
  customer: Customer;
  device: Device;
}

export function QrPrintReceipt({ ticket, customer, device }: QrPrintReceiptProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/repair/${ticket.publicToken}`);
  }, [ticket.publicToken]);

  if (!url) return null;

  return (
    <div className="print-receipt p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">Computer Ally</h1>
        <p className="text-sm text-muted-foreground">Repair Receipt</p>
      </div>

      <div className="flex justify-center mb-4">
        <QRCodeSVG value={url} size={160} />
      </div>

      <div className="text-center mb-4">
        <p className="font-bold text-lg">{ticket.jobNumber}</p>
        <p className="text-xs text-muted-foreground break-all">{url}</p>
      </div>

      <div className="border-t border-b py-3 mb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Customer:</span>
          <span>{customer.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Device:</span>
          <span>{device.make} {device.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Checked In:</span>
          <span>{formatDate(ticket.checkedInAt)}</span>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Scan the QR code to check your repair status anytime</p>
        <p>{contactInfo.address}</p>
        <p>{contactInfo.phone}</p>
        <p>Mon-Fri 9-6 | Sat 10-4</p>
      </div>
    </div>
  );
}
