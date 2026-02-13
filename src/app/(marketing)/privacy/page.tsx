import { PageHeading } from "@/components/shared/page-heading";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeading title="Privacy Policy" />
      <div className="prose prose-sm max-w-3xl space-y-4 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Effective Date:</strong> February 1, 2025</p>

        <h3 className="text-foreground font-semibold text-base">Information We Collect</h3>
        <p>
          When you bring a device in for repair, we collect your name, phone number, and email address
          for communication purposes. We also record your device details (make, model, serial number)
          and the reported issue to perform the repair.
        </p>

        <h3 className="text-foreground font-semibold text-base">How We Use Your Information</h3>
        <p>
          Your information is used solely to provide repair services, communicate repair status,
          and contact you when your device is ready. We do not sell, rent, or share your personal
          information with third parties for marketing purposes.
        </p>

        <h3 className="text-foreground font-semibold text-base">Device Data</h3>
        <p>
          During repair, we may need to access your device to diagnose and resolve issues. We access
          only what is necessary for the repair. We do not copy, retain, or browse personal files
          beyond what is required for the service.
        </p>

        <h3 className="text-foreground font-semibold text-base">Status Page</h3>
        <p>
          Your repair status page is accessible via a unique, hard-to-guess URL. It displays minimal
          information: device type, repair status, and service notes. No sensitive personal information
          is displayed on the public status page.
        </p>

        <h3 className="text-foreground font-semibold text-base">Data Retention</h3>
        <p>
          We retain repair records for 12 months after service completion for warranty and reference
          purposes. After this period, records are securely deleted.
        </p>

        <h3 className="text-foreground font-semibold text-base">Contact</h3>
        <p>
          For questions about this policy, contact us at hello@computerally.com or call (555) 123-4567.
        </p>
      </div>
    </div>
  );
}
