import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CONNECTION_POOL } from "./database.definitions";
import { databaseSchema } from "./database.schema";

@Injectable()
export class DatabaseService {
    public database: NodePgDatabase<typeof databaseSchema>;

    constructor(@Inject(CONNECTION_POOL) private pool: Pool) {
        this.database = drizzle(this.pool, { schema: databaseSchema });
    }
}