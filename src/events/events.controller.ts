import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './createEvents.dto';
import { UpdateEventDto } from './updateEvent.dto';
import { Event } from './event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';

@Controller({ path: '/events' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  
  constructor(
    @InjectRepository(Event) 
    private repository: Repository<Event>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>
  ) { }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      where: [{
        id: MoreThan(3),
        when: MoreThan(new Date('2021-02-12T13:00:00'))
      }, {
        description: Like('%meet%')
      }],
      take: 3,
      order: {
        id: 'DESC'
      }
    });
  }

  @Get('/practice-2')
  async secondPractice() {
    const event = await this.repository
      .createQueryBuilder('event')
      .select(['id', 'name', 'description'])
      .from(Event, 'event')
      .orderBy('id','DESC')
      .limit(2)

    const attendee = await this.attendeeRepository
      .createQueryBuilder('attendee')
      .select(['attendee.eventId', 'attendee.name'])
      .leftJoin(sq =>{
        sq.subQuery()
        event.getQuery()
      }, 'events')
      .where('attendee.eventId > 1')
      .setParameters(event.getParameters())
      .getRawMany()
    
    return attendee
  }


  @Get()
  async findAll() {
    try {
      this.logger.log(`Hit the findAll route`)
      const events = await this.repository.find();
      if(!events) throw new NotFoundException();      
      this.logger.debug(`Found ${events.length} events`)
      return events;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      const event = await this.repository.findOneBy({ id: Number(id) });
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
    const event = await this.repository.findOneBy(id);
    if(!event) throw new NotFoundException();
    return await this.repository.remove(event);
  }
}
