import { HeroSection } from "@/components/marketing/hero-section";
import { ProcessTimeline } from "@/components/marketing/process-timeline";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { TrustIndicators } from "@/components/marketing/trust-indicators";
import { CtaBanner } from "@/components/marketing/cta-banner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <ProcessTimeline />
      <ServicesGrid />
      <CtaBanner />
    </>
  );
}
