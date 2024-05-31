import { Column, ColumnBaseConfig, ColumnDataType, SelectedFields, sql, TableConfig } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgTable } from "drizzle-orm/pg-core";
import { databaseSchema } from "src/database/database.schema";

type result = { [key: string]: unknown; };

interface ICrudBase {
    database: NodePgDatabase<typeof databaseSchema>,
    table: PgTable<TableConfig>,
}

interface IExistsInDatabase extends ICrudBase {
    column: string,
    value: string | number;
}

interface ICreateInDatabase extends ICrudBase {
    values: Record<string, unknown>;
}

interface IExtractFieldsInDatabase extends ICrudBase {
    fields: SelectedFields<Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, any>;
}


export async function existsInDatabase({ column, database, table, value }: IExistsInDatabase): Promise<boolean | any> {
    const result = await database
        .select()
        .from(table)
        .where(sql`${sql.identifier(column)} = ${value}`)
        .limit(1)
        .execute();

    return result.length > 0 ? result[0] : false;
};

export async function createInDatabase({ database, table, values }: ICreateInDatabase): Promise<result> {
    const result = await database
        .insert(table)
        .values(values)
        .returning()
        .execute();

    return result[0];
}

export async function extractFieldsInDatabase({ database, fields, table }: IExtractFieldsInDatabase): Promise<result[]> {
    const result = await database
        .select(fields)
        .from(table)
        .execute();

    return result;
}