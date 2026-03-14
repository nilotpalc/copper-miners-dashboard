import { pgTable, text, serial, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  country: text("country").notNull(),
  marketCap: real("market_cap"),
  production: real("production"),
  reserveLife: real("reserve_life"),
  aisr: real("aisr"),
  capexIntensity: real("capex_intensity"),
});

export const oreGrades = pgTable("ore_grades", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  year: integer("year").notNull(),
  grade: real("grade").notNull(),
});

export const capexRecords = pgTable("capex_records", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  year: integer("year").notNull(),
  maintenance: real("maintenance"),
  growth: real("growth"),
  exploration: real("exploration"),
});

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export const insertOreGradeSchema = createInsertSchema(oreGrades).omit({ id: true });
export const insertCapexRecordSchema = createInsertSchema(capexRecords).omit({ id: true });

export type Company = typeof companies.$inferSelect;
export type OreGrade = typeof oreGrades.$inferSelect;
export type CapexRecord = typeof capexRecords.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertOreGrade = z.infer<typeof insertOreGradeSchema>;
export type InsertCapexRecord = z.infer<typeof insertCapexRecordSchema>;
