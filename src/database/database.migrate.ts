import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const database = drizzle(pool);

(async function () {
    try {
        console.log("migrating: migration started");
        await migrate(database, { migrationsFolder: './src/database/drizzle' });
        console.log("migrating: migration ended");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        process.exit(0);
    }
})();
