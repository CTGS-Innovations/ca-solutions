import { PageHeading } from "@/components/shared/page-heading";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeading title="Terms of Service" />
      <div className="prose prose-sm max-w-3xl space-y-4 text-sm text-muted-foreground">
        <p><strong className="text-foreground">Effective Date:</strong> February 1, 2025</p>

        <h3 className="text-foreground font-semibold text-base">Service Agreement</h3>
        <p>
          By leaving your device with Computer Ally for repair, you agree to these terms. We will
          diagnose the issue and provide a repair estimate before proceeding with any work that exceeds
          the standard diagnostic fee.
        </p>

        <h3 className="text-foreground font-semibold text-base">Estimates & Authorization</h3>
        <p>
          Repair estimates are provided after diagnostics. We will not proceed with repairs exceeding
          the estimate without your explicit approval via phone, email, or the status page.
        </p>

        <h3 className="text-foreground font-semibold text-base">Warranty</h3>
        <p>
          All repairs include a 30-day warranty covering the specific issue repaired. If the same
          problem recurs within 30 days, we will re-repair at no additional cost. This warranty does
          not cover new issues, physical damage, or software changes made after pickup.
        </p>

        <h3 className="text-foreground font-semibold text-base">Liability</h3>
        <p>
          While we take every precaution to protect your device and data, Computer Ally is not liable
          for pre-existing data loss, hardware failures unrelated to our repair, or issues arising
          from undisclosed damage. We strongly recommend the Data Backup Setup safeguard for
          additional protection.
        </p>

        <h3 className="text-foreground font-semibold text-base">Abandoned Devices</h3>
        <p>
          Devices not picked up within 60 days of the &ldquo;Ready for Pickup&rdquo; notification will be
          considered abandoned. We will make three contact attempts before disposal.
        </p>

        <h3 className="text-foreground font-semibold text-base">Payment</h3>
        <p>
          Payment is due at pickup unless prior arrangements have been made for business accounts.
          We accept cash, credit/debit cards, Apple Pay, Google Pay, and Venmo.
        </p>
      </div>
    </div>
  );
}
