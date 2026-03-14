import { build as esbuild } from "esbuild";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function build() {
  // Step 1: Build the client with Vite
  console.log("Building client with Vite...");
  execSync("npx vite build", { stdio: "inherit", cwd: rootDir });

  // Step 2: Build the server with esbuild
  console.log("Building server with esbuild...");
  await esbuild({
    entryPoints: [path.resolve(rootDir, "server/index.ts")],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: path.resolve(rootDir, "dist/index.cjs"),
    external: ["express", "drizzle-orm", "pg"],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  console.log("Build complete!");
}

build().catch(console.error);
