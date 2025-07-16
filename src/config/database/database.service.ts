import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JsPromise } from '@prisma/client/runtime/library';

/**
 * Database service
 * initialize the prisma client and connects to database
 */
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): JsPromise<void> {
    await this.$connect();
  }
}
