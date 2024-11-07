import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './db.service';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
