import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileShell } from "@/components/MobileShell";
import { addStudent } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/add-student")({
  head: () => ({ meta: [{ title: "Add Student — SPPS" }] }),
  component: AddStudent,
});

const empty = {
  name: "",
  usn: "",
  department: "",
  semester: "",
  attendance: "",
  internal: "",
  assignment: "",
};

function AddStudent() {
  const nav = useNavigate();
  const [form, setForm] = useState(empty);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.usn) {
      toast.error("Name and USN are required");
      return;
    }
    addStudent({
      name: form.name.trim(),
      usn: form.usn.trim().toUpperCase(),
      department: form.department.trim(),
      semester: form.semester.trim(),
      attendance: Number(form.attendance) || 0,
      internal: Number(form.internal) || 0,
      assignment: Number(form.assignment) || 0,
    });
    toast.success("Student saved");
    nav({ to: "/students" });
  }

  return (
    <MobileShell>
      <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--gradient-hero)] px-5 pb-8 pt-8 text-primary-foreground">
        <button
          onClick={() => nav({ to: "/dashboard" })}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary-foreground/90"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold">Add Student</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">Enter academic details</p>
      </div>

      <form
        onSubmit={save}
        className="-mt-6 mx-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]"
      >
        <Field label="Student Name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" className="h-11 rounded-xl" />
        </Field>
        <Field label="USN">
          <Input value={form.usn} onChange={(e) => set("usn", e.target.value)} placeholder="1MC22CS001" className="h-11 rounded-xl uppercase" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Department">
            <Input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="CSE" className="h-11 rounded-xl" />
          </Field>
          <Field label="Semester">
            <Input value={form.semester} onChange={(e) => set("semester", e.target.value)} placeholder="5" className="h-11 rounded-xl" />
          </Field>
        </div>
        <Field label="Attendance (%)">
          <Input type="number" min={0} max={100} value={form.attendance} onChange={(e) => set("attendance", e.target.value)} placeholder="85" className="h-11 rounded-xl" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Internal Marks (/30)">
            <Input type="number" min={0} max={30} value={form.internal} onChange={(e) => set("internal", e.target.value)} placeholder="22" className="h-11 rounded-xl" />
          </Field>
          <Field label="Assignment (/20)">
            <Input type="number" min={0} max={20} value={form.assignment} onChange={(e) => set("assignment", e.target.value)} placeholder="15" className="h-11 rounded-xl" />
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm(empty)}
            className="h-12 rounded-xl"
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="h-12 rounded-xl bg-[var(--gradient-primary)] font-semibold shadow-[var(--shadow-card)]"
          >
            Save
          </Button>
        </div>
      </form>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}