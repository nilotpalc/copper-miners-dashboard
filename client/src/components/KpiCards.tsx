import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign, Percent } from "lucide-react";
import type { Company, OreGrade, CapexRecord } from "@shared/schema";

interface KpiCardsProps {
  companies: Company[];
  oreGrades: OreGrade[];
  capex: CapexRecord[];
}

export default function KpiCards({ companies, oreGrades, capex }: KpiCardsProps) {
  // Calculate KPIs
  const latestYear = 2024;
  const prevYear = 2023;

  const latestGrades = oreGrades.filter((og) => og.year === latestYear);
  const prevGrades = oreGrades.filter((og) => og.year === prevYear);
  const avgGrade =
    latestGrades.reduce((sum, og) => sum + og.gradePercent, 0) / latestGrades.length;
  const prevAvgGrade =
    prevGrades.reduce((sum, og) => sum + og.gradePercent, 0) / prevGrades.length;
  const gradeChange = ((avgGrade - prevAvgGrade) / prevAvgGrade) * 100;

  const latestCapex = capex.filter((c) => c.year === latestYear);
  const totalCapex = latestCapex.reduce((sum, c) => sum + c.totalCapex, 0);
  const totalSustaining = latestCapex.reduce((sum, c) => sum + c.sustainingCapex, 0);
  const totalExpansionary = latestCapex.reduce((sum, c) => sum + c.expansionaryCapex, 0);
  const expansionaryPct = (totalExpansionary / totalCapex) * 100;

  const prevCapex = capex.filter((c) => c.year === prevYear);
  const prevTotalCapex = prevCapex.reduce((sum, c) => sum + c.totalCapex, 0);
  const capexChange = ((totalCapex - prevTotalCapex) / prevTotalCapex) * 100;

  const kpis = [
    {
      label: "Avg Ore Grade (2024)",
      value: `${avgGrade.toFixed(2)}%`,
      delta: gradeChange,
      icon: Percent,
      description: "Across 5 miners",
    },
    {
      label: "Total CapEx (2024)",
      value: `$${(totalCapex / 1000).toFixed(1)}B`,
      delta: capexChange,
      icon: DollarSign,
      description: "Copper segment",
    },
    {
      label: "Sustaining CapEx",
      value: `$${(totalSustaining / 1000).toFixed(1)}B`,
      delta: null,
      icon: TrendingDown,
      description: `${((totalSustaining / totalCapex) * 100).toFixed(0)}% of total`,
    },
    {
      label: "Expansionary CapEx",
      value: `$${(totalExpansionary / 1000).toFixed(1)}B`,
      delta: null,
      icon: TrendingUp,
      description: `${expansionaryPct.toFixed(0)}% of total`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => (
        <Card key={i} className="bg-card">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                <p
                  className="text-xl font-bold tracking-tight tabular-nums"
                  data-testid={`text-kpi-${i}`}
                  style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
                >
                  {kpi.value}
                </p>
              </div>
              <div className="p-1.5 rounded-md bg-primary/8">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {kpi.delta !== null && (
                <span
                  className={`text-xs font-medium tabular-nums ${
                    kpi.delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
                >
                  {kpi.delta > 0 ? "+" : ""}
                  {kpi.delta.toFixed(1)}%
                </span>
              )}
              <span className="text-xs text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
