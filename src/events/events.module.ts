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
import { CurrentEventAttendaceController } from './currentUserEventAttendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController, EventsOrganizedByUserController, EventAttendeeController, EventsOrganizedByUserController, ExampleController, CurrentEventAttendaceController],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}