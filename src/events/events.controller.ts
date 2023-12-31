import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEventDto } from './createEvents.dto';
import { UpdateEventDto } from './updateEvent.dto';
import { EventsService } from './event.service';
import { ListEvents } from './list.event';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller({ path: '/events' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    private readonly eventService: EventsService
  ) { }

  @Get()
  @UsePipes(new ValidationPipe({transform: true}))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log(`Hit the findAll route`)
    const events = await this.eventService
      .getEventWithAttendeeCountPaginated(filter, {
        currentPage: 1, limit: 10,
        totalPages: true
      })
    
    return events
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventService.getEvent(id);
    if(!event) throw new NotFoundException();

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventService.createEvent(input, user);
  }
  
  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(202)
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto, @CurrentUser() user: User) {
    const event = await this.eventService.getEvent(id);
    
    if(!event) throw new NotFoundException();

    if(event.organizerId !== user.id) throw new ForbiddenException(null, 'You are not authorized to modified this event.');

    return await this.eventService.updateEvent(input, event);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventService.getEvent(id);
    if(!event) throw new NotFoundException();

    if(event.organizerId !== user.id) throw new ForbiddenException(null, 'You are not authorized to modified this event.');

    const result = await this.eventService.deleteEvent(id);
    return result.affected;
  }
}
