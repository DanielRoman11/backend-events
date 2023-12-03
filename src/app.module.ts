import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from "@nestjs/config";
import { EventsModule } from './events/events.module';
import { AppColombiaService } from './app.Colombia.service';
import { AppDummy } from './app.dummy';
import ormConfig from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      // expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [{
    provide: AppService,
    useClass: AppColombiaService
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
