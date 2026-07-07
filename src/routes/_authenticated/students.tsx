import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Trash2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/MobileShell";
import { deleteStudent, predict, useStudents } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/students")({
  head: () => ({ meta: [{ title: "Students — SPPS" }] }),
  component: StudentsPage,
});

type Filter = "all" | "pass" | "fail";

function StudentsPage() {
  const nav = useNavigate();
  const students = useStudents();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    return students.filter((s) => {
      const p = predict(s.attendance, s.internal, s.assignment);
      if (filter === "pass" && !p.pass) return false;
      if (filter === "fail" && p.pass) return false;
      if (!q) return true;
      const t = q.toLowerCase();
      return (
        s.name.toLowerCase().includes(t) ||
        s.usn.toLowerCase().includes(t) ||
        s.department.toLowerCase().includes(t)
      );
    });
  }, [students, q, filter]);

  return (
    <MobileShell>
      <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--gradient-hero)] px-5 pb-8 pt-8 text-primary-foreground">
        <button
          onClick={() => nav({ to: "/dashboard" })}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary-foreground/90"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">Students</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">{students.length} registered</p>
          </div>
          <Link
            to="/add-student"
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-white/15 px-3 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur"
          >
            <Plus size={16} /> Add
          </Link>
        </div>

        <div className="relative mt-5">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, USN, dept…"
            className="h-11 rounded-xl border-none bg-white pl-10 text-foreground shadow-md"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 px-5">
        <SlidersHorizontal size={16} className="text-muted-foreground" />
        {(["all", "pass", "fail"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {students.length === 0 ? "No students yet. Tap Add." : "No matches."}
            </p>
          </div>
        )}
        {list.map((s) => {
          const p = predict(s.attendance, s.internal, s.assignment);
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--gradient-primary)] text-sm font-bold text-primary-foreground">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.usn} · {s.department || "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    p.pass
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {p.pass ? "PASS" : "FAIL"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-secondary/40 p-2">
                <Mini label="Attend." value={`${s.attendance}%`} />
                <Mini label="Internal" value={`${s.internal}/30`} />
                <Mini label="Assign." value={`${s.assignment}/20`} />
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-xl"
                  onClick={() => toast.info("Edit coming soon")}
                >
                  <Pencil size={14} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    deleteStudent(s.id);
                    toast.success("Deleted");
                  }}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}