import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEventDto } from './createEvents.dto';
import { UpdateEventDto } from './updateEvent.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { EventsService } from './event.service';
import { ListEvents } from './list.event';

@Controller({ path: '/events' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event) 
    private repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventsService
  ) { }

  @Get()
  @UsePipes(new ValidationPipe({transform: true}))
  async findAll(@Query() filter: ListEvents) {
    try {
      this.logger.log(`Hit the findAll route`)
      const events = await this.eventService
        .getEventWithAttendeeCountPaginated(filter, {currentPage: 1, limit: 10, totalPages: true})

      return events
    } catch (error) {
      throw new Error(error);
    }
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      const event = await this.eventService.getEvent(Number(id));
      if(!event) throw new NotFoundException();

      return event;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    const newEvent = {
      ...input,
      when: new Date(input.when)
    }
    try {
      return await this.repository.save(newEvent)
    } catch (error) {
      throw new Error(error);
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto) {
    try {
      const event = await this.repository.findOneBy(id);
      if(!event) throw new NotFoundException();

      return await this.repository.save({
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : event.when
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id) {
    const result = await this.eventService.deleteEvent(id);

    if(result?.affected === 0) throw new NotFoundException();

    return result.affected
  }
}
