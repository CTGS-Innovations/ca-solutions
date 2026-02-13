"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monitor, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tickets/new", label: "New Ticket", icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r bg-sidebar min-h-screen">
      <div className="flex items-center gap-2 px-4 h-14 border-b font-bold">
        <Monitor className="h-5 w-5 text-primary" />
        <span className="text-sm">Computer Ally</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
