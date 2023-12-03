import { Body, Controller, Delete, Get, HttpCode, Logger, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './createEvents.dto';
import { UpdateEventDto } from './updateEvent.dto';
import { Event } from './event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller({ path: '/events' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  
  constructor(
    @InjectRepository(Event) 
    private repository: Repository<Event>
  ) { }

  @Get()
  async findAll() {
    this.logger.log(`Hit the findAll route`)
    const events = await this.repository.find();
    return events;
  }

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.repository.findOneBy({ id: Number(id) });
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    const newEvent = {
      ...input,
      when: new Date(input.when)
    }

    return await this.repository.save(newEvent)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy(id);

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id) {
    const event = await this.repository.findOneBy(id);
    return await this.repository.remove(event);
  }
}
