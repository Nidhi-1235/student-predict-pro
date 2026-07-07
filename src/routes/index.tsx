import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      const authed = typeof window !== "undefined" && localStorage.getItem("spps.auth");
      navigate({ to: authed ? "/dashboard" : "/login" });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--gradient-hero)] text-primary-foreground">
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center animate-fade-in">
        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/15 backdrop-blur-md shadow-2xl ring-1 ring-white/20 animate-scale-in">
          <GraduationCap size={52} strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Student Performance</h1>
          <p className="text-lg font-semibold text-primary-foreground/90">Prediction System</p>
        </div>
        <div className="mt-4 flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/90 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/90 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}