import { PageHeading } from "@/components/shared/page-heading";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { CtaBanner } from "@/components/marketing/cta-banner";

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageHeading
          title="Our Services"
          description="Professional computer repair with full transparency. Every service includes our baseline diagnostic and testing process."
        />
      </div>
      <ServicesGrid />
      <CtaBanner />
    </>
  );
}
