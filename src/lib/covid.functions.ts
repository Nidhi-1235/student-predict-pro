import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const covidGlobalSchema = z.object({
  updated: z.number(),
  cases: z.number(),
  todayCases: z.number(),
  deaths: z.number(),
  todayDeaths: z.number(),
  recovered: z.number(),
  todayRecovered: z.number(),
  active: z.number(),
  critical: z.number(),
  tests: z.number(),
  population: z.number(),
  affectedCountries: z.number(),
});

export type CovidGlobalSummary = {
  updatedAt: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  tests: number;
  population: number;
  affectedCountries: number;
  deathRate: number;
  recoveryRate: number;
  activeRate: number;
};

export const getCovidGlobalSummary = createServerFn({ method: "GET" }).handler(
  async (): Promise<CovidGlobalSummary> => {
    const response = await fetch("https://disease.sh/v3/covid-19/all", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch COVID-19 data: ${response.statusText}`);
    }

    const raw = await response.json();
    const data = covidGlobalSchema.parse(raw);

    const cases = data.cases || 1;

    return {
      updatedAt: new Date(data.updated).toISOString(),
      cases: data.cases,
      todayCases: data.todayCases,
      deaths: data.deaths,
      todayDeaths: data.todayDeaths,
      recovered: data.recovered,
      todayRecovered: data.todayRecovered,
      active: data.active,
      critical: data.critical,
      tests: data.tests,
      population: data.population,
      affectedCountries: data.affectedCountries,
      deathRate: Number(((data.deaths / cases) * 100).toFixed(2)),
      recoveryRate: Number(((data.recovered / cases) * 100).toFixed(2)),
      activeRate: Number(((data.active / cases) * 100).toFixed(2)),
    };
  },
);
