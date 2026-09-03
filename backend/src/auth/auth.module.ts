import { Module, Global, DynamicModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { createAuthInstance } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

import { BETTER_AUTH } from './auth.constants';

export * from './auth.constants';

@Global()
@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [
        {
          provide: BETTER_AUTH,
          // Inject connection đã được MongooseModule khởi tạo ở AppModule
          inject: [getConnectionToken()],
          useFactory: (connection: Connection) => {
            // Lấy Db object trực tiếp từ Mongoose Connection
            const db = connection.db;
            if (!db) {
              throw new Error('Mongoose Connection chưa sẵn sàng hoặc chưa kết nối thành công tới MongoDB.');
            }
            return createAuthInstance(db);
          },
        },
        AuthGuard,
      ],
      exports: [BETTER_AUTH, AuthGuard],
    };
  }
}