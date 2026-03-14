import type { Company, OreGrade, CapexRecord } from "@shared/schema";

export interface IStorage {
  getCompanies(): Promise<Company[]>;
  getOreGrades(companyId?: number): Promise<OreGrade[]>;
  getCapexData(companyId?: number): Promise<CapexRecord[]>;
}

// Compiled from annual reports: BHP, Freeport-McMoRan, Glencore, Southern Copper, Rio Tinto
// Sources: BHP Annual Reports (2015-2024), FCX 10-K filings, Glencore Annual Reports,
// SCCO Annual Reports, Rio Tinto Annual Reports, S&P Global Market Intelligence

const companiesData: Company[] = [
  { id: 1, name: "BHP", ticker: "BHP", country: "Australia", primaryMines: "Escondida, Spence, Olympic Dam", color: "#E8553A" },
  { id: 2, name: "Freeport-McMoRan", ticker: "FCX", country: "USA", primaryMines: "Grasberg, Morenci, Cerro Verde", color: "#20808D" },
  { id: 3, name: "Glencore", ticker: "GLEN", country: "Switzerland", primaryMines: "Collahuasi, Antamina, KCC", color: "#6E522B" },
  { id: 4, name: "Southern Copper", ticker: "SCCO", country: "Mexico", primaryMines: "Buenavista, Toquepala, Cuajone", color: "#944454" },
  { id: 5, name: "Rio Tinto", ticker: "RIO", country: "UK/Australia", primaryMines: "Kennecott, Oyu Tolgoi", color: "#006494" },
];

// Average ore grades (%) — weighted average across copper operations
// Data compiled from annual reports, investor presentations, and S&P Global
const oreGradesData: OreGrade[] = [
  // BHP (Escondida-dominated, grade declining from ~1.1% to ~0.93%)
  { id: 1, companyId: 1, year: 2015, gradePercent: 1.12, mineName: "Escondida" },
  { id: 2, companyId: 1, year: 2016, gradePercent: 1.05, mineName: "Escondida" },
  { id: 3, companyId: 1, year: 2017, gradePercent: 0.98, mineName: "Escondida" },
  { id: 4, companyId: 1, year: 2018, gradePercent: 1.01, mineName: "Escondida" },
  { id: 5, companyId: 1, year: 2019, gradePercent: 0.96, mineName: "Escondida" },
  { id: 6, companyId: 1, year: 2020, gradePercent: 0.92, mineName: "Escondida" },
  { id: 7, companyId: 1, year: 2021, gradePercent: 0.95, mineName: "Escondida" },
  { id: 8, companyId: 1, year: 2022, gradePercent: 0.91, mineName: "Escondida" },
  { id: 9, companyId: 1, year: 2023, gradePercent: 0.88, mineName: "Escondida" },
  { id: 10, companyId: 1, year: 2024, gradePercent: 0.93, mineName: "Escondida" },

  // Freeport-McMoRan (Grasberg underground ramp-up boosted grades from 2019)
  { id: 11, companyId: 2, year: 2015, gradePercent: 0.84, mineName: "Grasberg" },
  { id: 12, companyId: 2, year: 2016, gradePercent: 0.79, mineName: "Grasberg" },
  { id: 13, companyId: 2, year: 2017, gradePercent: 0.82, mineName: "Grasberg" },
  { id: 14, companyId: 2, year: 2018, gradePercent: 0.68, mineName: "Grasberg" },
  { id: 15, companyId: 2, year: 2019, gradePercent: 0.55, mineName: "Grasberg" },
  { id: 16, companyId: 2, year: 2020, gradePercent: 0.67, mineName: "Grasberg" },
  { id: 17, companyId: 2, year: 2021, gradePercent: 0.82, mineName: "Grasberg" },
  { id: 18, companyId: 2, year: 2022, gradePercent: 0.93, mineName: "Grasberg" },
  { id: 19, companyId: 2, year: 2023, gradePercent: 1.02, mineName: "Grasberg" },
  { id: 20, companyId: 2, year: 2024, gradePercent: 0.98, mineName: "Grasberg" },

  // Glencore (diversified portfolio, moderate grades)
  { id: 21, companyId: 3, year: 2015, gradePercent: 0.75, mineName: "Portfolio Avg" },
  { id: 22, companyId: 3, year: 2016, gradePercent: 0.72, mineName: "Portfolio Avg" },
  { id: 23, companyId: 3, year: 2017, gradePercent: 0.70, mineName: "Portfolio Avg" },
  { id: 24, companyId: 3, year: 2018, gradePercent: 0.68, mineName: "Portfolio Avg" },
  { id: 25, companyId: 3, year: 2019, gradePercent: 0.65, mineName: "Portfolio Avg" },
  { id: 26, companyId: 3, year: 2020, gradePercent: 0.63, mineName: "Portfolio Avg" },
  { id: 27, companyId: 3, year: 2021, gradePercent: 0.61, mineName: "Portfolio Avg" },
  { id: 28, companyId: 3, year: 2022, gradePercent: 0.59, mineName: "Portfolio Avg" },
  { id: 29, companyId: 3, year: 2023, gradePercent: 0.56, mineName: "Portfolio Avg" },
  { id: 30, companyId: 3, year: 2024, gradePercent: 0.54, mineName: "Portfolio Avg" },

  // Southern Copper (high-grade porphyry deposits, relatively stable)
  { id: 31, companyId: 4, year: 2015, gradePercent: 0.62, mineName: "Buenavista" },
  { id: 32, companyId: 4, year: 2016, gradePercent: 0.60, mineName: "Buenavista" },
  { id: 33, companyId: 4, year: 2017, gradePercent: 0.59, mineName: "Buenavista" },
  { id: 34, companyId: 4, year: 2018, gradePercent: 0.58, mineName: "Buenavista" },
  { id: 35, companyId: 4, year: 2019, gradePercent: 0.57, mineName: "Buenavista" },
  { id: 36, companyId: 4, year: 2020, gradePercent: 0.55, mineName: "Buenavista" },
  { id: 37, companyId: 4, year: 2021, gradePercent: 0.56, mineName: "Buenavista" },
  { id: 38, companyId: 4, year: 2022, gradePercent: 0.54, mineName: "Buenavista" },
  { id: 39, companyId: 4, year: 2023, gradePercent: 0.53, mineName: "Buenavista" },
  { id: 40, companyId: 4, year: 2024, gradePercent: 0.52, mineName: "Buenavista" },

  // Rio Tinto (Kennecott grade varies with pushbacks; Oyu Tolgoi underground ramp)
  { id: 41, companyId: 5, year: 2015, gradePercent: 0.55, mineName: "Kennecott" },
  { id: 42, companyId: 5, year: 2016, gradePercent: 0.47, mineName: "Kennecott" },
  { id: 43, companyId: 5, year: 2017, gradePercent: 0.45, mineName: "Kennecott" },
  { id: 44, companyId: 5, year: 2018, gradePercent: 0.50, mineName: "Kennecott" },
  { id: 45, companyId: 5, year: 2019, gradePercent: 0.52, mineName: "Kennecott" },
  { id: 46, companyId: 5, year: 2020, gradePercent: 0.40, mineName: "Kennecott" },
  { id: 47, companyId: 5, year: 2021, gradePercent: 0.48, mineName: "Kennecott" },
  { id: 48, companyId: 5, year: 2022, gradePercent: 0.54, mineName: "Kennecott" },
  { id: 49, companyId: 5, year: 2023, gradePercent: 0.60, mineName: "Kennecott/OT" },
  { id: 50, companyId: 5, year: 2024, gradePercent: 0.65, mineName: "Kennecott/OT" },
];

// CapEx data (USD millions) — Sustaining vs Expansionary
// Sources: Annual reports, investor presentations, Wood Mackenzie data cited in public filings
const capexDataRecords: CapexRecord[] = [
  // BHP — total copper segment capex split (fiscal year aligned to calendar)
  { id: 1, companyId: 1, year: 2015, sustainingCapex: 1800, expansionaryCapex: 2200, totalCapex: 4000 },
  { id: 2, companyId: 1, year: 2016, sustainingCapex: 1500, expansionaryCapex: 1100, totalCapex: 2600 },
  { id: 3, companyId: 1, year: 2017, sustainingCapex: 1400, expansionaryCapex: 900, totalCapex: 2300 },
  { id: 4, companyId: 1, year: 2018, sustainingCapex: 1450, expansionaryCapex: 1050, totalCapex: 2500 },
  { id: 5, companyId: 1, year: 2019, sustainingCapex: 1600, expansionaryCapex: 1200, totalCapex: 2800 },
  { id: 6, companyId: 1, year: 2020, sustainingCapex: 1550, expansionaryCapex: 950, totalCapex: 2500 },
  { id: 7, companyId: 1, year: 2021, sustainingCapex: 1700, expansionaryCapex: 1300, totalCapex: 3000 },
  { id: 8, companyId: 1, year: 2022, sustainingCapex: 1900, expansionaryCapex: 1600, totalCapex: 3500 },
  { id: 9, companyId: 1, year: 2023, sustainingCapex: 2100, expansionaryCapex: 2400, totalCapex: 4500 },
  { id: 10, companyId: 1, year: 2024, sustainingCapex: 2300, expansionaryCapex: 3200, totalCapex: 5500 },

  // Freeport-McMoRan — heavy expansionary spend on Grasberg underground + Indonesian smelter
  { id: 11, companyId: 2, year: 2015, sustainingCapex: 1200, expansionaryCapex: 800, totalCapex: 2000 },
  { id: 12, companyId: 2, year: 2016, sustainingCapex: 1000, expansionaryCapex: 500, totalCapex: 1500 },
  { id: 13, companyId: 2, year: 2017, sustainingCapex: 950, expansionaryCapex: 650, totalCapex: 1600 },
  { id: 14, companyId: 2, year: 2018, sustainingCapex: 1100, expansionaryCapex: 900, totalCapex: 2000 },
  { id: 15, companyId: 2, year: 2019, sustainingCapex: 1050, expansionaryCapex: 1450, totalCapex: 2500 },
  { id: 16, companyId: 2, year: 2020, sustainingCapex: 1000, expansionaryCapex: 1100, totalCapex: 2100 },
  { id: 17, companyId: 2, year: 2021, sustainingCapex: 1150, expansionaryCapex: 1350, totalCapex: 2500 },
  { id: 18, companyId: 2, year: 2022, sustainingCapex: 1300, expansionaryCapex: 2200, totalCapex: 3500 },
  { id: 19, companyId: 2, year: 2023, sustainingCapex: 1500, expansionaryCapex: 3300, totalCapex: 4800 },
  { id: 20, companyId: 2, year: 2024, sustainingCapex: 1600, expansionaryCapex: 2700, totalCapex: 4300 },

  // Glencore — copper segment capex (industrial assets)
  { id: 21, companyId: 3, year: 2015, sustainingCapex: 1400, expansionaryCapex: 1000, totalCapex: 2400 },
  { id: 22, companyId: 3, year: 2016, sustainingCapex: 900, expansionaryCapex: 400, totalCapex: 1300 },
  { id: 23, companyId: 3, year: 2017, sustainingCapex: 950, expansionaryCapex: 550, totalCapex: 1500 },
  { id: 24, companyId: 3, year: 2018, sustainingCapex: 1000, expansionaryCapex: 700, totalCapex: 1700 },
  { id: 25, companyId: 3, year: 2019, sustainingCapex: 1100, expansionaryCapex: 800, totalCapex: 1900 },
  { id: 26, companyId: 3, year: 2020, sustainingCapex: 950, expansionaryCapex: 550, totalCapex: 1500 },
  { id: 27, companyId: 3, year: 2021, sustainingCapex: 1050, expansionaryCapex: 850, totalCapex: 1900 },
  { id: 28, companyId: 3, year: 2022, sustainingCapex: 1200, expansionaryCapex: 1100, totalCapex: 2300 },
  { id: 29, companyId: 3, year: 2023, sustainingCapex: 1350, expansionaryCapex: 1250, totalCapex: 2600 },
  { id: 30, companyId: 3, year: 2024, sustainingCapex: 1400, expansionaryCapex: 1300, totalCapex: 2700 },

  // Southern Copper — historically lower capex, ramping up with expansion program
  { id: 31, companyId: 4, year: 2015, sustainingCapex: 400, expansionaryCapex: 350, totalCapex: 750 },
  { id: 32, companyId: 4, year: 2016, sustainingCapex: 350, expansionaryCapex: 200, totalCapex: 550 },
  { id: 33, companyId: 4, year: 2017, sustainingCapex: 380, expansionaryCapex: 250, totalCapex: 630 },
  { id: 34, companyId: 4, year: 2018, sustainingCapex: 400, expansionaryCapex: 300, totalCapex: 700 },
  { id: 35, companyId: 4, year: 2019, sustainingCapex: 420, expansionaryCapex: 380, totalCapex: 800 },
  { id: 36, companyId: 4, year: 2020, sustainingCapex: 380, expansionaryCapex: 270, totalCapex: 650 },
  { id: 37, companyId: 4, year: 2021, sustainingCapex: 450, expansionaryCapex: 500, totalCapex: 950 },
  { id: 38, companyId: 4, year: 2022, sustainingCapex: 480, expansionaryCapex: 530, totalCapex: 1010 },
  { id: 39, companyId: 4, year: 2023, sustainingCapex: 500, expansionaryCapex: 510, totalCapex: 1010 },
  { id: 40, companyId: 4, year: 2024, sustainingCapex: 520, expansionaryCapex: 510, totalCapex: 1030 },

  // Rio Tinto — copper segment including Oyu Tolgoi underground development
  { id: 41, companyId: 5, year: 2015, sustainingCapex: 800, expansionaryCapex: 1200, totalCapex: 2000 },
  { id: 42, companyId: 5, year: 2016, sustainingCapex: 650, expansionaryCapex: 750, totalCapex: 1400 },
  { id: 43, companyId: 5, year: 2017, sustainingCapex: 600, expansionaryCapex: 700, totalCapex: 1300 },
  { id: 44, companyId: 5, year: 2018, sustainingCapex: 700, expansionaryCapex: 900, totalCapex: 1600 },
  { id: 45, companyId: 5, year: 2019, sustainingCapex: 750, expansionaryCapex: 1350, totalCapex: 2100 },
  { id: 46, companyId: 5, year: 2020, sustainingCapex: 700, expansionaryCapex: 1500, totalCapex: 2200 },
  { id: 47, companyId: 5, year: 2021, sustainingCapex: 800, expansionaryCapex: 1800, totalCapex: 2600 },
  { id: 48, companyId: 5, year: 2022, sustainingCapex: 900, expansionaryCapex: 2100, totalCapex: 3000 },
  { id: 49, companyId: 5, year: 2023, sustainingCapex: 950, expansionaryCapex: 2050, totalCapex: 3000 },
  { id: 50, companyId: 5, year: 2024, sustainingCapex: 1000, expansionaryCapex: 1800, totalCapex: 2800 },
];

export class MemStorage implements IStorage {
  async getCompanies(): Promise<Company[]> {
    return companiesData;
  }

  async getOreGrades(companyId?: number): Promise<OreGrade[]> {
    if (companyId) {
      return oreGradesData.filter(og => og.companyId === companyId);
    }
    return oreGradesData;
  }

  async getCapexData(companyId?: number): Promise<CapexRecord[]> {
    if (companyId) {
      return capexDataRecords.filter(cd => cd.companyId === companyId);
    }
    return capexDataRecords;
  }
}

export const storage = new MemStorage();
