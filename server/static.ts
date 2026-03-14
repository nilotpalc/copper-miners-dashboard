import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { log } from "./vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  log(`Serving static files from ${distPath}`);
}
