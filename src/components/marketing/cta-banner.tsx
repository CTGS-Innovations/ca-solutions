import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
          Drop off your device and track the entire repair process from your phone.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/admin/tickets/new">
            <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <QrCode className="h-4 w-4" />
              Start a Repair
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
