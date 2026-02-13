import { PageHeading } from "@/components/shared/page-heading";
import { ContactInfoSection } from "@/components/marketing/contact-info";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeading
        title="Contact Us"
        description="Visit us in person, give us a call, or drop off your device during business hours."
      />
      <ContactInfoSection />
    </div>
  );
}
