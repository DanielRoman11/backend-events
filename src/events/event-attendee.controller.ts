import { ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, SerializeOptions, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendee.service";
import { Attendee } from "./attendee.entity";

@Controller('events/:eventId/Attendees')
@SerializeOptions({strategy: 'excludeAll'})
export class EventAttendeeController{
  constructor(
    private readonly attendeesService: AttendeesService
  ) { }

  /**
   * Get all Attendees from a specific event
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getAll(@Param('eventId', new ParseIntPipe()) eventId: number): Promise<Attendee> {
    return await this.attendeesService.findByEventId(eventId)
  }
}