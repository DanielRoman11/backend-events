import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { AttendeesService } from "./attendee.service";
import { CreateAttendeeDto } from "./input/createAttendee.dto";


@Controller('events-attendance')
export class CurrentEventAttendaceController {
  constructor(
    private readonly attendeService: AttendeesService,
    private readonly eventsService: AttendeesService
  ){ }


  @Get()
  async findAll() { }
  
  @Get('/:id')
  async findOne(@Param('id', new ParseIntPipe()) eventId){
    return await this.attendeService.findByEventId(eventId)
  }
  
  async createOrUpdate() {
    
  }
}