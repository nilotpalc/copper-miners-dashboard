import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Company, CapexRecord } from "@shared/schema";

interface CapexStackedChartProps {
  capex: CapexRecord[];
  companies: Company[];
  selectedCompany: string;
}

export default function CapexStackedChart({
  capex,
  companies,
  selectedCompany,
}: CapexStackedChartProps) {
  const years = [...new Set(capex.map((c) => c.year))].sort();

  if (selectedCompany !== "all") {
    // Single company: show sustaining vs expansionary as stacked area
    const company = companies.find((c) => c.id === Number(selectedCompany));
    const chartData = years.map((year) => {
      const record = capex.find(
        (c) => c.year === year && c.companyId === Number(selectedCompany)
      );
      return {
        year: String(year),
        Sustaining: record?.sustainingCapex ?? 0,
        Expansionary: record?.expansionaryCapex ?? 0,
      };
    });

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
          <Area
            type="monotone"
            dataKey="Sustaining"
            stackId="1"
            stroke="#20808D"
            fill="#20808D"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="Expansionary"
            stackId="1"
            stroke="#A84B2F"
            fill="#A84B2F"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // All companies: show total capex per company as stacked area
  const chartData = years.map((year) => {
    const row: Record<string, number | string> = { year: String(year) };
    companies.forEach((c) => {
      const record = capex.find(
        (rec) => rec.year === year && rec.companyId === c.id
      );
      row[c.ticker] = record?.totalCapex ?? 0;
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
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
        {companies.map((c) => (
          <Area
            key={c.id}
            type="monotone"
            dataKey={c.ticker}
            stackId="1"
            stroke={c.color}
            fill={c.color}
            fillOpacity={0.5}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
