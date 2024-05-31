import { ConfigService } from "@nestjs/config";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const configService = new ConfigService();

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/database.schema.ts",
    out: "./src/database/drizzle",
    dbCredentials: {
        database: configService.get('POSTGRES_DB'),
        host: configService.get('POSTGRES_HOST'),
        password: configService.get('POSTGRES_PASSWORD'),
        port: configService.get('POSTGRES_PORT'),
        user: configService.get('POSTGRES_USER'),
    }
});