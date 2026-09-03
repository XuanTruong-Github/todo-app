import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        authSource: 'admin',
        dbName: 'todo',
      }),
    }),
    TodoModule,
    AuthModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD, // 👈 Đăng ký AuthGuard làm Global Guard
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
