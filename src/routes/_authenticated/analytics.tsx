import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { predict, useStudents } from "@/lib/store";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SPPS" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const nav = useNavigate();
  const students = useStudents();

  const results = students.map((s) => ({
    ...s,
    ...predict(s.attendance, s.internal, s.assignment),
  }));
  const pass = results.filter((r) => r.pass).length;
  const fail = results.length - pass;
  const passPct = results.length ? Math.round((pass / results.length) * 100) : 0;
  const avgInternal = results.length
    ? Math.round(results.reduce((a, r) => a + r.internal, 0) / results.length)
    : 0;

  const pieData = [
    { name: "Pass", value: pass },
    { name: "Fail", value: fail },
  ];
  const pieColors = ["oklch(0.65 0.17 145)", "oklch(0.6 0.23 25)"];

  const barData = results.slice(0, 8).map((r) => ({
    name: r.name.split(" ")[0].slice(0, 6),
    attendance: r.attendance,
  }));

  return (
    <MobileShell>
      <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--gradient-hero)] px-5 pb-8 pt-8 text-primary-foreground">
        <button
          onClick={() => nav({ to: "/dashboard" })}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary-foreground/90"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">Class-wide overview</p>
      </div>

      <div className="-mt-6 grid grid-cols-3 gap-3 px-5">
        <StatCard label="Total" value={results.length} />
        <StatCard label="Pass %" value={`${passPct}%`} />
        <StatCard label="Avg IA" value={`${avgInternal}/30`} />
      </div>

      <div className="mt-5 px-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold text-foreground">Pass vs Fail</h2>
          {results.length === 0 ? (
            <Empty />
          ) : (
            <div className="mt-2 h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={4}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <Legend color="oklch(0.65 0.17 145)" label={`Pass · ${pass}`} />
            <Legend color="oklch(0.6 0.23 25)" label={`Fail · ${fail}`} />
          </div>
        </div>
      </div>

      <div className="mt-4 px-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <h2 className="text-sm font-semibold text-foreground">Attendance (%)</h2>
          {barData.length === 0 ? (
            <Empty />
          ) : (
            <div className="mt-2 h-56">
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="attendance" radius={[8, 8, 0, 0]} fill="oklch(0.55 0.19 260)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)]">
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}

function Empty() {
  return (
    <div className="grid h-40 place-items-center text-sm text-muted-foreground">
      Add students to see charts
    </div>
  );
}