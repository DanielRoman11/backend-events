import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { ConfigModule } from "@nestjs/config";
import { EventsModule } from './events/events.module';
import { AppColombiaService } from './app.Colombia.service';
import { AppDummy } from './app.dummy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Event],
      synchronize: process.env.DB_SYNC === 'development'
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
