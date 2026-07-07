import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, KeyRound, Info, LogOut, Mail, Building2 } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { logout } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SPPS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const nav = useNavigate();

  return (
    <MobileShell>
      <PageHeader title="Profile" subtitle="Manage your admin account" />

      <div className="-mt-8 px-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--gradient-primary)] text-2xl font-black text-primary-foreground shadow-md">
              A
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground">Admin User</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Mail size={12} /> admin@meridian.edu
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 size={12} /> Meridian College of Engineering
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <Row
            icon={<KeyRound size={18} />}
            label="Change Password"
            onClick={() => toast.info("Password reset link sent (demo).")}
          />
          <Row
            icon={<Info size={18} />}
            label="About"
            onClick={() =>
              toast.info("SPPS v1.0 · Predict student outcomes using attendance & marks.")
            }
          />
          <Row
            icon={<LogOut size={18} className="text-destructive" />}
            label="Logout"
            danger
            onClick={() => {
              logout();
              toast.success("Logged out");
              nav({ to: "/login" });
            }}
          />
        </div>
      </div>
    </MobileShell>
  );
}

function Row({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/50"
    >
      <div
        className={
          "grid h-9 w-9 place-items-center rounded-xl " +
          (danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")
        }
      >
        {icon}
      </div>
      <span
        className={"flex-1 text-sm font-medium " + (danger ? "text-destructive" : "text-foreground")}
      >
        {label}
      </span>
      <ChevronRight size={16} className="text-muted-foreground" />
    </button>
  );
}