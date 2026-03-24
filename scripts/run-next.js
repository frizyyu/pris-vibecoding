const { spawn } = require("node:child_process");
const path = require("node:path");

const nextCommand = process.argv[2];
const nextArgs = process.argv.slice(3);

if (!nextCommand) {
  console.error("Usage: node scripts/run-next.js <dev|build|start> [...args]");
  process.exit(1);
}

const projectRoot = process.cwd();
const nextBin = require.resolve("next/dist/bin/next");
const env = { ...process.env };

if (process.platform === "win32") {
  env.HOME = projectRoot;
  env.USERPROFILE = projectRoot;
}

const child = spawn(process.execPath, [nextBin, nextCommand, ...nextArgs], {
  cwd: projectRoot,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});
