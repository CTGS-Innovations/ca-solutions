"use client";

import Link from "next/link";
import { Monitor, Menu, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="md:hidden sticky top-0 z-40 w-full border-b bg-card">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-sm">
          <Monitor className="h-5 w-5 text-primary" />
          Admin Console
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div
        className={cn(
          "border-t overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-60" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-secondary"
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href="/admin/tickets/new"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-secondary"
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle className="h-4 w-4" /> New Ticket
          </Link>
          <button
            onClick={() => { logout(); setMobileOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-secondary text-left"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
