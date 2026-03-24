const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const projectRoot = process.cwd();
const prismaDir = path.join(projectRoot, "prisma");
const migrationsDir = path.join(prismaDir, "migrations");
const dbPath = path.join(prismaDir, "dev.db");

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS __local_migrations (
    id TEXT PRIMARY KEY,
    appliedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const applied = new Set(
  db.prepare("SELECT id FROM __local_migrations").all().map((row) => row.id),
);

const migrationDirs = fs
  .readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const migrationId of migrationDirs) {
  if (applied.has(migrationId)) {
    continue;
  }

  const sqlPath = path.join(migrationsDir, migrationId, "migration.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  db.exec("BEGIN");
  try {
    db.exec(sql);
    db.prepare("INSERT INTO __local_migrations (id) VALUES (?)").run(migrationId);
    db.exec("COMMIT");
    console.log(`Applied migration: ${migrationId}`);
  } catch (error) {
    db.exec("ROLLBACK");

    if (String(error.message).includes("already exists")) {
      db.prepare("INSERT INTO __local_migrations (id) VALUES (?)").run(migrationId);
      console.log(`Marked existing migration as applied: ${migrationId}`);
      continue;
    }

    throw error;
  }
}

db.close();
console.log(`Database is ready at ${dbPath}`);
