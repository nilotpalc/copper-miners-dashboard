import type { Company, OreGrade } from "@shared/schema";

interface OreGradeHeatmapProps {
  oreGrades: OreGrade[];
  companies: Company[];
}

export default function OreGradeHeatmap({ oreGrades, companies }: OreGradeHeatmapProps) {
  const years = [...new Set(oreGrades.map((og) => og.year))].sort();
  const minGrade = Math.min(...oreGrades.map((og) => og.gradePercent));
  const maxGrade = Math.max(...oreGrades.map((og) => og.gradePercent));

  function getColor(value: number): string {
    const ratio = (value - minGrade) / (maxGrade - minGrade);
    // Interpolate from light warm (low grade) to deep teal (high grade)
    const r = Math.round(230 - ratio * 198);
    const g = Math.round(230 - ratio * 98);
    const b = Math.round(225 - ratio * 84);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function getTextColor(value: number): string {
    const ratio = (value - minGrade) / (maxGrade - minGrade);
    return ratio > 0.55 ? "#fff" : "#333";
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Year headers */}
      <div className="flex mb-1">
        <div className="w-16 flex-shrink-0" />
        <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${years.length}, 1fr)` }}>
          {years.map((y) => (
            <div
              key={y}
              className="text-center text-[10px] text-muted-foreground font-medium tabular-nums"
            >
              {String(y).slice(2)}
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 flex flex-col gap-1">
        {companies.map((c) => (
          <div key={c.id} className="flex items-center flex-1">
            <div
              className="w-16 flex-shrink-0 text-[11px] font-medium truncate pr-2"
              title={c.name}
            >
              {c.ticker}
            </div>
            <div
              className="flex-1 grid gap-0.5 h-full"
              style={{ gridTemplateColumns: `repeat(${years.length}, 1fr)` }}
            >
              {years.map((year) => {
                const record = oreGrades.find(
                  (og) => og.companyId === c.id && og.year === year
                );
                const grade = record?.gradePercent ?? 0;
                return (
                  <div
                    key={year}
                    className="rounded-sm flex items-center justify-center cursor-default transition-transform hover:scale-105"
                    style={{
                      backgroundColor: getColor(grade),
                      color: getTextColor(grade),
                    }}
                    title={`${c.name} ${year}: ${grade.toFixed(2)}%`}
                    data-testid={`heatmap-cell-${c.id}-${year}`}
                  >
                    <span className="text-[9px] font-medium tabular-nums">
                      {grade.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-border">
        <span className="text-[10px] text-muted-foreground">Low</span>
        <div
          className="h-2 w-24 rounded-full"
          style={{
            background: `linear-gradient(to right, ${getColor(minGrade)}, ${getColor(
              (minGrade + maxGrade) / 2
            )}, ${getColor(maxGrade)})`,
          }}
        />
        <span className="text-[10px] text-muted-foreground">High</span>
      </div>
    </div>
  );
}
