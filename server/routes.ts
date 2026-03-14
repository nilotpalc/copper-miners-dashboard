import type { Express } from "express";
import type { Server } from "http";
import { createServer } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/companies", async (_req, res) => {
    const companies = await storage.getCompanies();
    res.json(companies);
  });

  app.get("/api/ore-grades", async (req, res) => {
    const companyId = req.query.companyId
      ? Number(req.query.companyId)
      : undefined;
    const oreGrades = await storage.getOreGrades(companyId);
    res.json(oreGrades);
  });

  app.get("/api/capex", async (req, res) => {
    const companyId = req.query.companyId
      ? Number(req.query.companyId)
      : undefined;
    const capex = await storage.getCapexRecords(companyId);
    res.json(capex);
  });

  const httpServer = createServer(app);
  return httpServer;
}
