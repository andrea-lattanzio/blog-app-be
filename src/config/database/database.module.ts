import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * Database module
 * exports DatabaseService to be used in other modules module
 */
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
