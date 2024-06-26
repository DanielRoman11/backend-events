import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeesService } from './attendee.service';
import { CreateAttendeeDto } from './input/createAttendee.dto';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { EventsService } from './event.service';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Attendees')
@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentEventAttendaceController {
  private readonly logger = new Logger(CurrentEventAttendaceController.name)
  constructor(private readonly attendeService: AttendeesService, private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: User, @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page = 1) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(user.id, {
      currentPage: page,
      limit: 10,
    });
  }

  @Get('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  async findOne(@Param('eventId', new ParseIntPipe()) eventId, @CurrentUser() user: User) {
    const attendee = await this.attendeService.findOneByEventIdAndUserId(user.id, eventId);

    if (!attendee) throw new NotFoundException();

    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  async createOrUpdate(@Param('eventId', new ParseIntPipe()) eventId: number, @Body() input: CreateAttendeeDto, @CurrentUser() user: User) {
    const eventExists = await this.eventsService.findOne(eventId)
    if(!eventExists){
      const errorException = new NotFoundException(`Event with ID ${eventId} not found`)
      this.logger.warn(errorException)
      throw errorException
    }
    return this.attendeService.createOrUpdate(input, eventId, user.id)
  }
}
