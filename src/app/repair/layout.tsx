import Link from "next/link";
import { Monitor } from "lucide-react";

export default function RepairLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-2xl flex items-center justify-center h-12 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm">
            <Monitor className="h-4 w-4 text-primary" />
            <span>Computer Ally</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
