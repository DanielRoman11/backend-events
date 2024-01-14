import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, NotFoundException, Param, ParseIntPipe, Put, Query, SerializeOptions, UseGuards, UseInterceptors } from "@nestjs/common";
import { AttendeesService } from "./attendee.service";
import { CreateAttendeeDto } from "./input/createAttendee.dto";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { EventsService } from "./event.service";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";

@Controller('events-attendance')
@SerializeOptions({strategy: 'excludeAll'})
export class CurrentEventAttendaceController {
  constructor(
    private readonly attendeService: AttendeesService,
    private readonly eventsService: EventsService
  ){ }


  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() user: User, @Query('page', ParseIntPipe, new DefaultValuePipe(1)) page = 1) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(user.id, {
      currentPage: page,
      limit: 10
    })
  }
  
  @Get('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('eventId', new ParseIntPipe()) eventId, @CurrentUser() user: User){
    const attendee = await this.attendeService.findOneByEventIdAndUserId(user.id, eventId);

    if(!attendee) throw new NotFoundException()

    return attendee;
  }
  
  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(@Param('eventId', ParseIntPipe) eventId: number, @Body() input: CreateAttendeeDto, @CurrentUser() user: User) {
    return this.attendeService.createOrUpdate(input, eventId, user.id)
  }
}