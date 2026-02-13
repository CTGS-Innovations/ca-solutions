import { PageHeading } from "@/components/shared/page-heading";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeading
        title="Frequently Asked Questions"
        description="Quick answers to common questions about our repair process, pricing, and policies."
      />
      <FaqAccordion />
    </div>
  );
}
