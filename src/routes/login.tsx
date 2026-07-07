import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Student Performance Prediction System" },
      { name: "description", content: "Sign in to manage students and predict performance." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(username.trim(), password)) {
      toast.success("Welcome back!");
      nav({ to: "/dashboard" });
    } else {
      toast.error("Enter username and password");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
        <div className="relative overflow-hidden rounded-b-[36px] bg-[var(--gradient-hero)] px-6 pb-14 pt-12 text-primary-foreground">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="flex flex-col items-center gap-3 text-center animate-fade-in">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <GraduationCap size={32} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">
                Meridian College of Engineering
              </p>
              <h1 className="mt-1 text-xl font-bold">Welcome back</h1>
            </div>
          </div>
        </div>

        <div className="-mt-8 px-5">
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)]"
          >
            <h2 className="text-lg font-semibold text-foreground">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use your admin credentials to continue.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="h-12 rounded-xl pl-10"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast.info("Contact your administrator to reset your password.")}
                className="block w-full text-right text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl bg-[var(--gradient-primary)] text-base font-semibold shadow-[var(--shadow-card)] transition-transform hover:scale-[1.01]"
            >
              Login
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo credentials pre-filled — tap Login to continue.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}