const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = process.cwd();
const generatedDir = path.join(projectRoot, "src", "generated", "prisma");
const generatedMarker = path.join(generatedDir, "index.js");

if (fs.existsSync(generatedMarker)) {
  console.log(`Prisma client already exists at ${generatedDir}`);
  process.exit(0);
}

const prismaBin = require.resolve("prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaBin, "generate"], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
