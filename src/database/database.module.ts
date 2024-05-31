import { Global, Module } from "@nestjs/common";
import { Pool } from "pg";
import { CONNECTION_POOL, ConfigurableDatabaseModule, DATABASE_MODULE_OPTIONS } from "./database.definitions";
import { DatabaseOptions } from "./database.types";
import { DatabaseService } from "./database.service";

@Global()
@Module({
    exports: [DatabaseService],
    providers: [DatabaseService, {
        provide: CONNECTION_POOL,
        inject: [DATABASE_MODULE_OPTIONS],
        useFactory: function (databaseOptions: DatabaseOptions) {
            return new Pool({
                database: databaseOptions.database,
                host: databaseOptions.host,
                password: databaseOptions.password,
                port: databaseOptions.port,
                user: databaseOptions.user,
            });
        },
    }],
})

export class DatabaseModule extends ConfigurableDatabaseModule { }