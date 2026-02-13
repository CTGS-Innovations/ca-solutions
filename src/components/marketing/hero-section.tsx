import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContent } from "@/data/site-content";
import { QrCode, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {heroContent.headline}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {heroContent.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/admin/tickets/new">
            <Button size="default" className="gap-2">
              <QrCode className="h-4 w-4" />
              Start a Repair
            </Button>
          </Link>
          <Link href="/process">
            <Button variant="outline" size="default" className="gap-2">
              {heroContent.ctaSecondary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
