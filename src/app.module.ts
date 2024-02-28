import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { EventsModule } from './events/events.module';
import { AppColombiaService } from './app.Colombia.service';
import { AppDummy } from './app.dummy';
import { Authmodule } from './auth/auth.module';
import { DatabaseModule } from './config/database.module';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
    }),
    EventsModule,
    Authmodule,
    DatabaseModule
  ],
  controllers: [AppController, ],
  providers: [{
    provide: AppService,
    useClass: AppColombiaService,
  },{
    provide: 'APP_NAME',
    useValue: 'Nest Events Backend'
  },{
    provide: 'MESSAGE',
    inject: [AppDummy],
    useFactory: (app) => `${app.dummy()} Factory!`
  }, AppDummy],
})
export class AppModule { }

