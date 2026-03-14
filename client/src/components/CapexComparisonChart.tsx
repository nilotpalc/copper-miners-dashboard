import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import type { Company, CapexRecord } from "@shared/schema";

interface CapexComparisonChartProps {
  capex: CapexRecord[];
  companies: Company[];
}

export default function CapexComparisonChart({
  capex,
  companies,
}: CapexComparisonChartProps) {
  // Show 2024 data as grouped bars
  const chartData = companies.map((c) => {
    const record = capex.find(
      (rec) => rec.companyId === c.id && rec.year === 2024
    );
    return {
      name: c.ticker,
      Sustaining: record?.sustainingCapex ?? 0,
      Expansionary: record?.expansionaryCapex ?? 0,
      color: c.color,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        barGap={2}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fontWeight: 500 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={{ className: "stroke-border" }}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}B`}
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
            `$${value.toLocaleString()}M`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="square"
          iconSize={10}
        />
        <Bar dataKey="Sustaining" fill="#20808D" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Expansionary" fill="#A84B2F" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
