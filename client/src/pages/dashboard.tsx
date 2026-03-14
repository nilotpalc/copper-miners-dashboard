import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, TrendingDown, DollarSign, BarChart3, Building2 } from "lucide-react";
import OreGradeChart from "@/components/OreGradeChart";
import CapexStackedChart from "@/components/CapexStackedChart";
import CapexComparisonChart from "@/components/CapexComparisonChart";
import OreGradeHeatmap from "@/components/OreGradeHeatmap";
import CapexRatioChart from "@/components/CapexRatioChart";
import KpiCards from "@/components/KpiCards";
import type { Company, OreGrade, CapexRecord } from "@shared/schema";

interface DashboardData {
  companies: Company[];
  oreGrades: OreGrade[];
  capex: CapexRecord[];
}

export default function Dashboard() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading || !data) {
    return <DashboardSkeleton isDark={isDark} setIsDark={setIsDark} />;
  }

  const { companies, oreGrades, capex } = data;

  const filteredOreGrades =
    selectedCompany === "all"
      ? oreGrades
      : oreGrades.filter((og) => og.companyId === Number(selectedCompany));

  const filteredCapex =
    selectedCompany === "all"
      ? capex
      : capex.filter((c) => c.companyId === Number(selectedCompany));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight" data-testid="text-app-title">
                Copper Miners Analytics
              </h1>
              <p className="text-xs text-muted-foreground">
                Top 5 Global Producers — 10-Year Data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[200px] h-8 text-sm" data-testid="select-company">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} ({c.ticker})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDark(!isDark)}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-5 space-y-5 max-w-[1440px] mx-auto">
        {/* KPI Row */}
        <KpiCards companies={companies} oreGrades={oreGrades} capex={capex} />

        {/* Company Badges */}
        <div className="flex flex-wrap gap-2">
          {companies.map((c) => (
            <Badge
              key={c.id}
              variant="outline"
              className="cursor-pointer text-xs py-1 px-2.5"
              style={{
                borderColor: c.color,
                backgroundColor:
                  selectedCompany === String(c.id) ? c.color + "18" : "transparent",
              }}
              onClick={() =>
                setSelectedCompany(
                  selectedCompany === String(c.id) ? "all" : String(c.id)
                )
              }
              data-testid={`badge-company-${c.id}`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
              <span className="text-muted-foreground ml-1">{c.ticker}</span>
            </Badge>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="ore-grade" className="space-y-4">
          <TabsList className="bg-muted/50" data-testid="tabs-main">
            <TabsTrigger value="ore-grade" className="text-sm gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Ore Grade
            </TabsTrigger>
            <TabsTrigger value="capex" className="text-sm gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              CapEx Split
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-sm gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ore-grade" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Copper Ore Grade (%) — 10-Year Trend
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Weighted average grade across primary copper operations. Industry trend shows secular decline.
                  </p>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <OreGradeChart
                    oreGrades={filteredOreGrades}
                    companies={companies}
                    selectedCompany={selectedCompany}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Grade Heatmap by Year
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Darker = higher ore grade. Shows relative positioning.
                  </p>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <OreGradeHeatmap oreGrades={oreGrades} companies={companies} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="capex" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sustaining vs Expansionary CapEx (USD M)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Stacked area chart showing capital allocation strategy across copper operations.
                  </p>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <CapexStackedChart
                    capex={filteredCapex}
                    companies={companies}
                    selectedCompany={selectedCompany}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Expansionary Share of Total CapEx
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Higher ratio = more growth-oriented spending profile.
                  </p>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <CapexRatioChart capex={capex} companies={companies} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  CapEx Comparison by Company (2024)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Grouped bar chart: sustaining (lighter) vs expansionary (darker) for most recent year.
                </p>
              </CardHeader>
              <CardContent className="h-[400px]">
                <CapexComparisonChart capex={capex} companies={companies} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Data Sources */}
        <Card className="bg-muted/30">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground/70">Data sources:</span>{" "}
              BHP Annual Reports (2015–2024), Freeport-McMoRan 10-K filings (SEC EDGAR),
              Glencore Annual Reports, Southern Copper Annual Reports,
              Rio Tinto Annual Reports & Investor Presentations.
              Ore grades represent weighted average across primary copper operations.
              CapEx figures represent copper segment capital expenditure as reported or estimated from disclosed breakdowns.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function DashboardSkeleton({
  isDark,
  setIsDark,
}: {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}) {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="px-6 py-5 space-y-5 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </main>
    </div>
  );
}
