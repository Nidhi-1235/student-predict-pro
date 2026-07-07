import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileShell } from "@/components/MobileShell";
import { predict } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/predict")({
  head: () => ({ meta: [{ title: "Predict — SPPS" }] }),
  component: PredictPage,
});

function PredictPage() {
  const nav = useNavigate();
  const [attendance, setAttendance] = useState("");
  const [internal, setInternal] = useState("");
  const [assignment, setAssignment] = useState("");
  const [result, setResult] = useState<ReturnType<typeof predict> | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const r = predict(Number(attendance) || 0, Number(internal) || 0, Number(assignment) || 0);
    setResult(r);
  }

  const tips = [
    { text: "Improve attendance", need: Number(attendance) < 75 },
    { text: "Complete assignments", need: Number(assignment) < 15 },
    { text: "Increase internal marks", need: Number(internal) < 20 },
  ].filter((t) => t.need);

  return (
    <MobileShell>
      <div className="relative overflow-hidden rounded-b-[28px] bg-[var(--gradient-hero)] px-5 pb-8 pt-8 text-primary-foreground">
        <button
          onClick={() => nav({ to: "/dashboard" })}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary-foreground/90"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold">Predict Performance</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">Get a pass/fail forecast</p>
      </div>

      <form
        onSubmit={run}
        className="-mt-6 mx-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]"
      >
        <Field label="Attendance (%)">
          <Input type="number" min={0} max={100} value={attendance} onChange={(e) => setAttendance(e.target.value)} placeholder="85" className="h-11 rounded-xl" />
        </Field>
        <Field label="Internal Marks (/30)">
          <Input type="number" min={0} max={30} value={internal} onChange={(e) => setInternal(e.target.value)} placeholder="22" className="h-11 rounded-xl" />
        </Field>
        <Field label="Assignment (/20)">
          <Input type="number" min={0} max={20} value={assignment} onChange={(e) => setAssignment(e.target.value)} placeholder="16" className="h-11 rounded-xl" />
        </Field>

        <Button
          type="submit"
          className="mt-4 h-12 w-full rounded-xl bg-[var(--gradient-primary)] text-base font-semibold shadow-[var(--shadow-card)]"
        >
          <Sparkles size={18} /> Predict
        </Button>
      </form>

      {result && (
        <div className="mt-5 px-5 animate-fade-in">
          <div
            className={cn(
              "overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-elevated)]",
              result.pass
                ? "bg-gradient-to-br from-emerald-500 to-green-500"
                : "bg-gradient-to-br from-rose-500 to-red-500",
            )}
          >
            <div className="flex items-center gap-4">
              <CircularProgress value={result.confidence} />
              <div>
                <div className="flex items-center gap-2">
                  {result.pass ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                  <p className="text-2xl font-black tracking-tight">
                    {result.pass ? "PASS" : "FAIL"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-white/90">
                  Confidence <span className="font-bold">{result.confidence}%</span>
                </p>
                <p className="text-xs text-white/75">Composite score {result.score}/100</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Lightbulb size={16} />
              </div>
              <h3 className="font-semibold text-foreground">Recommendations</h3>
            </div>
            {tips.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Great work — keep maintaining current levels.
              </p>
            ) : (
              <ul className="space-y-2">
                {tips.map((t) => (
                  <li
                    key={t.text}
                    className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
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

function CircularProgress({ value }: { value: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8" />
      <circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 42 42)"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
      <text x="42" y="47" textAnchor="middle" fontSize="18" fontWeight="800" fill="white">
        {value}%
      </text>
    </svg>
  );
}