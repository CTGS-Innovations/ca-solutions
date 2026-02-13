import Link from "next/link";
import { Monitor } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Monitor className="h-5 w-5 text-primary" />
              <span>Computer Ally</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Computer repair you can actually see. Transparent process, real-time tracking, honest pricing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground transition-colors">All Services</Link></li>
              <li><Link href="/process" className="hover:text-foreground transition-colors">Our Process</Link></li>
              <li><Link href="/business" className="hover:text-foreground transition-colors">Business Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Computer Ally. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
