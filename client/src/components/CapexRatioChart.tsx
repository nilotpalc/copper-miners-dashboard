import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import type { Company, CapexRecord } from "@shared/schema";

interface CapexRatioChartProps {
  capex: CapexRecord[];
  companies: Company[];
}

export default function CapexRatioChart({ capex, companies }: CapexRatioChartProps) {
  const years = [...new Set(capex.map((c) => c.year))].sort();

  const chartData = years.map((year) => {
    const row: Record<string, number | string> = { year: String(year) };
    companies.forEach((c) => {
      const record = capex.find(
        (rec) => rec.year === year && rec.companyId === c.id
      );
      if (record) {
        row[c.ticker] = Math.round(
          (record.expansionaryCapex / record.totalCapex) * 100
        );
      }
    });
    return row;
  });

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
          tickFormatter={(v: number) => `${v}%`}
          domain={[0, 80]}
        />
        <ReferenceLine
          y={50}
          stroke="hsl(var(--muted-foreground))"
          strokeDasharray="4 4"
          strokeOpacity={0.4}
          label={{
            value: "50% line",
            position: "insideTopRight",
            fill: "hsl(var(--muted-foreground))",
            fontSize: 10,
          }}
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
            `${value}%`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
          iconSize={8}
        />
        {companies.map((c) => (
          <Line
            key={c.id}
            type="monotone"
            dataKey={c.ticker}
            stroke={c.color}
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={{ r: 2.5, fill: c.color, strokeWidth: 0 }}
            activeDot={{ r: 4.5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
