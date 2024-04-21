import { ClassSerializerInterceptor, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { EventsService } from './event.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attendees')
@Controller('events-by-user/:userId')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * find All events created by a single user
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(@Param('userId', ParseIntPipe) userId: number, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(userId, { currentPage: page, limit: 10 });
  }
}
