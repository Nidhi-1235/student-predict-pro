import { createFileRoute, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  Activity,
  HeartPulse,
  RefreshCw,
  Skull,
  Stethoscope,
  Users,
  Virus,
} from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { getCovidGlobalSummary, type CovidGlobalSummary } from "@/lib/covid.functions";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const covidSummaryQueryOptions = queryOptions({
  queryKey: ["covid", "global-summary"],
  queryFn: () => getCovidGlobalSummary(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/covid-dashboard")({
  head: () => ({
    meta: [
      { title: "COVID-19 Global Dashboard — Live Statistics" },
      {
        name: "description",
        content:
          "Track live global COVID-19 statistics including cases, deaths, recoveries, active cases, and vaccination progress.",
      },
      { property: "og:title", content: "COVID-19 Global Dashboard — Live Statistics" },
      {
        property: "og:description",
        content:
          "Track live global COVID-19 statistics including cases, deaths, recoveries, active cases, and vaccination progress.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(covidSummaryQueryOptions),
  component: CovidDashboard,
  errorComponent: CovidError,
  notFoundComponent: () => <div>COVID-19 dashboard not found.</div>,
});

function CovidDashboard() {
  const { data: summary } = useSuspenseQuery(covidSummaryQueryOptions);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    await router.invalidate();
    setIsRefreshing(false);
  }

  return (
    <MobileShell>
      <PageHeader
        title="COVID-19 Dashboard"
        subtitle="Global live statistics"
        right={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur transition-transform active:scale-95"
            aria-label="Refresh data"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        }
      />

      <div className="-mt-6 px-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Last updated</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {new Date(summary.updatedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SummaryCard
            label="Total Cases"
            value={summary.cases}
            icon={Virus}
            tint="from-blue-500 to-sky-400"
            delta={summary.todayCases}
          />
          <SummaryCard
            label="Total Deaths"
            value={summary.deaths}
            icon={Skull}
            tint="from-rose-500 to-red-400"
            delta={summary.todayDeaths}
          />
          <SummaryCard
            label="Recovered"
            value={summary.recovered}
            icon={HeartPulse}
            tint="from-emerald-500 to-teal-400"
            delta={summary.todayRecovered}
          />
          <SummaryCard
            label="Active Cases"
            value={summary.active}
            icon={Activity}
            tint="from-amber-500 to-orange-400"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <RateCard label="Death Rate" value={`${summary.deathRate}%`} icon={Stethoscope} />
          <RateCard label="Recovery Rate" value={`${summary.recoveryRate}%`} icon={HeartPulse} />
          <RateCard label="Active Rate" value={`${summary.activeRate}%`} icon={Activity} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <SimpleCard label="Critical" value={summary.critical} icon={Activity} />
          <SimpleCard label="Countries" value={summary.affectedCountries} icon={Users} />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Data provided by{" "}
          <a
            href="https://disease.sh/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            disease.sh
          </a>
          . Figures are approximate and may differ by source.
        </p>
      </div>
    </MobileShell>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tint,
  delta,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  tint: string;
  delta?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div
        className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-md`}
      >
        <Icon size={20} />
      </div>
      <p className="text-xl font-bold text-foreground">{formatNumber(value)}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      {typeof delta === "number" && delta > 0 && (
        <p className="mt-1 text-[11px] font-medium text-destructive">+{formatNumber(delta)} today</p>
      )}
    </div>
  );
}

function RateCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-[var(--shadow-card)]">
      <Icon size={18} className="mx-auto mb-2 text-muted-foreground" />
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function SimpleCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{formatNumber(value)}</p>
    </div>
  );
}

function CovidError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <MobileShell>
      <PageHeader title="COVID-19 Dashboard" subtitle="Global live statistics" />
      <div className="-mt-6 px-5">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
          <p className="text-sm text-muted-foreground">
            {error.message || "Unable to load COVID-19 data. Please try again."}
          </p>
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="mt-4 h-11 rounded-xl bg-[var(--gradient-primary)] font-semibold"
          >
            Try again
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

function formatNumber(value: number): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
  }).format(value);
}
