import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { ExampleController } from './example.Controller';
import { EventsService } from './event.service';
import { AttendeesService } from './attendee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee])
  ],
  controllers: [EventsController, ExampleController],
  providers: [EventsService, AttendeesService]
})
export class EventsModule {}
