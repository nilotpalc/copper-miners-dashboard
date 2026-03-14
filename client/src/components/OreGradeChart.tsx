import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Company, OreGrade } from "@shared/schema";

interface OreGradeChartProps {
  oreGrades: OreGrade[];
  companies: Company[];
  selectedCompany: string;
}

export default function OreGradeChart({
  oreGrades,
  companies,
  selectedCompany,
}: OreGradeChartProps) {
  // Transform data: pivot to { year, BHP, FCX, GLEN, ... }
  const years = [...new Set(oreGrades.map((og) => og.year))].sort();

  const chartData = years.map((year) => {
    const row: Record<string, number | string> = { year: String(year) };
    companies.forEach((c) => {
      const match = oreGrades.find(
        (og) => og.year === year && og.companyId === c.id
      );
      if (match) {
        row[c.ticker] = match.gradePercent;
      }
    });
    return row;
  });

  const visibleCompanies =
    selectedCompany === "all"
      ? companies
      : companies.filter((c) => c.id === Number(selectedCompany));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={{ className: "stroke-border" }}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          formatter={(value: number, name: string) => [
            `${value.toFixed(2)}%`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
          iconSize={8}
        />
        {visibleCompanies.map((c) => (
          <Line
            key={c.id}
            type="monotone"
            dataKey={c.ticker}
            stroke={c.color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: c.color, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
