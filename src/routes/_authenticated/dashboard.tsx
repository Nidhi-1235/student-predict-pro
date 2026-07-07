import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  UserPlus,
  Users,
  Search,
  Sparkles,
  BarChart3,
  LogOut,
  Bell,
} from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { logout, useStudents } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Student Performance Prediction System" },
      { name: "description", content: "Overview of students and performance metrics." },
    ],
  }),
  component: Dashboard,
});

const cards = [
  { to: "/add-student", label: "Add Student", icon: UserPlus, tint: "from-blue-500 to-blue-400" },
  { to: "/students", label: "View Students", icon: Users, tint: "from-indigo-500 to-blue-400" },
  { to: "/students", label: "Search Student", icon: Search, tint: "from-sky-500 to-cyan-400" },
  { to: "/predict", label: "Predict Performance", icon: Sparkles, tint: "from-violet-500 to-indigo-400" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, tint: "from-blue-600 to-sky-400" },
] as const;

function Dashboard() {
  const students = useStudents();
  const nav = useNavigate();
  const passCount = students.filter((s) => s.attendance >= 75 && s.internal >= 15).length;
  const passPct = students.length ? Math.round((passCount / students.length) * 100) : 0;

  return (
    <MobileShell>
      <PageHeader
        title="Hello, Admin"
        subtitle="Meridian College of Engineering"
        right={
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        }
      />

      <div className="-mt-6 px-5">
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <Stat label="Students" value={students.length} />
          <Stat label="Likely Pass" value={passCount} />
          <Stat label="Pass %" value={`${passPct}%`} />
        </div>
      </div>

      <div className="mt-6 px-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {cards.map(({ to, label, icon: Icon, tint }) => (
            <Link
              key={label}
              to={to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
            >
              <div
                className={`mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-md`}
              >
                <Icon size={20} />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Tap to open</p>
            </Link>
          ))}
          <button
            onClick={() => {
              logout();
              nav({ to: "/login" });
            }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-red-400 text-white shadow-md">
              <LogOut size={20} />
            </div>
            <p className="text-sm font-semibold text-foreground">Logout</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Sign out</p>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}