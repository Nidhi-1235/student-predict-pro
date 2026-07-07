import { type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, LineChart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/students", label: "Students", icon: Users },
  { to: "/predict", label: "Prediction", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileShell({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
        <main className={cn("flex-1 pb-24", hideNav && "pb-0")}>{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}

function BottomNav() {
  const pathname = useLocation({ select: (l) => l.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="flex items-center justify-around rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-[var(--shadow-elevated)] backdrop-blur">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--gradient-hero)] px-6 pb-8 pt-10 text-primary-foreground shadow-[var(--shadow-elevated)]">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-primary-foreground/80">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}