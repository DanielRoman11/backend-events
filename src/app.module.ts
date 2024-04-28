import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { Authmodule } from './auth/auth.module';
import { DatabaseModule } from './config/database.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    EventsModule,
    Authmodule,
    DatabaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
