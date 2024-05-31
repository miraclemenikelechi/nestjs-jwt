import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseOptions } from './database.types';

export const CONNECTION_POOL = "CONNECTION_POOL";

export const {
    ConfigurableModuleClass: ConfigurableDatabaseModule,
    MODULE_OPTIONS_TOKEN: DATABASE_MODULE_OPTIONS
} = new ConfigurableModuleBuilder<DatabaseOptions>()
    .setClassMethodName('forRoot')
    .build();