import { Module } from '@nestjs/common';
import { dbDataAccessProvider } from './db-data-access.provider';

@Module({
  providers: [dbDataAccessProvider],
  exports: [dbDataAccessProvider],
})
export class DrizzleDataAccessModule { }
