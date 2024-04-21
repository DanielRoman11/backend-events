import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { Authmodule } from './auth/auth.module';
import { DatabaseModule } from './config/database.module';

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
})
export class AppModule {}
