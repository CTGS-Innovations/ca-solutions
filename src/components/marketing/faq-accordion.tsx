"use client";

import { useState } from "react";
import { faqs } from "@/data/site-content";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto divide-y">
      {faqs.map((faq, idx) => (
        <div key={idx}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="flex items-center justify-between w-full py-4 text-left text-sm font-medium hover:text-primary transition-colors"
          >
            <span>{faq.question}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 ml-2 transition-transform",
                openIndex === idx && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              openIndex === idx ? "max-h-96 pb-4" : "max-h-0"
            )}
          >
            <p className="text-sm text-muted-foreground">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
