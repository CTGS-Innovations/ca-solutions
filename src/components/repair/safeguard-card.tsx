"use client";

import { AddOnCatalogItem, AddOnRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

interface SafeguardCardProps {
  item: AddOnCatalogItem;
  existingRequest?: AddOnRequest;
  onRequest: () => void;
}

export function SafeguardCard({ item, existingRequest, onRequest }: SafeguardCardProps) {
  const isRequested = !!existingRequest;
  const isApproved = existingRequest?.status === "approved";
  const isDeclined = existingRequest?.status === "declined";

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-sm">{item.name}</h4>
          {item.price > 0 ? (
            <span className="text-sm font-bold text-primary shrink-0">${item.price}</span>
          ) : (
            <span className="text-xs font-medium text-accent shrink-0">Free</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
        <p className="text-xs mb-3">
          <span className="font-medium">Why it matters:</span>{" "}
          <span className="text-muted-foreground">{item.whyItMatters}</span>
        </p>
        {isApproved ? (
          <div className="flex items-center gap-1 text-xs text-accent font-medium">
            <Check className="h-3 w-3" /> Approved
          </div>
        ) : isDeclined ? (
          <div className="text-xs text-muted-foreground">Declined</div>
        ) : isRequested ? (
          <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Clock className="h-3 w-3" /> Requested — pending review
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={onRequest} className="w-full">
            Request This Safeguard
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
