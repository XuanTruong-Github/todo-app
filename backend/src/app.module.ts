import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Connection } from 'mongoose';
import { createAuthInstance } from './configs/auth.config';

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
    AuthModule.forRootAsync({
      inject: [getConnectionToken()],
      useFactory: async (connection: Connection) => {
        const db = connection.db;
        if (!db) {
          throw new Error(
            'Mongoose Connection chưa sẵn sàng hoặc chưa kết nối thành công tới MongoDB.',
          );
        }
        return {
          auth: createAuthInstance(db),
          bodyParser: {
            json: { limit: '2mb' },
            urlencoded: { limit: '2mb', extended: true },
            rawBody: true,
          },
        };
      },
    }),
    TodoModule,
  ],
  controllers: [],
})
export class AppModule {}
