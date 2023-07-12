import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './createEvents.dto';
import { UpdateEventDto } from './updateEvent.dto';
import { Event } from './event.entity';

@Controller({ path: '/events' })
export class EventsController {
  private events: Event[] = [];
  @Get()
  findAll() {
    return this.events;
  }
  @Get(':id')
  findOne(@Param('id') id) {
    const event: Event = this.events.find((event) => event.id === Number(id));
    return event;
  }
  @Post()
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    return event;
  }
  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === Number(id));

    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    };
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };
    return event;
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    return this.events.filter((event) => event.id !== Number(id));
  }
}
