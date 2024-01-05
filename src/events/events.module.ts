import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './attendee.entity';
import { ExampleController } from './example.Controller';
import { EventsService } from './event.service';
import { AttendeesService } from './attendee.service';
import { EventAttendeeController } from './event-attendee.controller';
import { EventsOrganizedByUserController } from './events-by-user.Controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee])
  ],
  controllers: [EventsController, ExampleController, EventAttendeeController, EventsOrganizedByUserController],
  providers: [EventsService, AttendeesService]
})
export class EventsModule {}
