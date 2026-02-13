import { PageHeading } from "@/components/shared/page-heading";
import { ProcessTimeline } from "@/components/marketing/process-timeline";
import { baselineChecklistTemplate } from "@/data/baseline-checklist";
import { Check } from "lucide-react";
import { CtaBanner } from "@/components/marketing/cta-banner";

export default function ProcessPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageHeading
          title="Our Process"
          description="This is what sets us apart. Every repair follows a structured, transparent process — so you always know what's happening with your device."
        />
      </div>
      <ProcessTimeline />
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Every Repair Includes</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            These baseline checks are included with every repair at no extra cost.
          </p>
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
            {baselineChecklistTemplate.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
