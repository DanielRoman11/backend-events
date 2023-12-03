import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event])
  ],
  controllers: [EventsController]
})
export class EventsModule {}
