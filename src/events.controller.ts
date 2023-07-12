import {
  Body,
  Controller,
  Delete,
  Get,
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
    [
      {
        ...this.events,
        when: new Date(input.when),
        id: this.events.length + 1,
      },
    ];
  }
  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event: Event = this.events.find((event) => event.id === Number(id));
    input;
    return event;
  }
  @Delete(':id')
  remove(@Param('id') id) {
    return this.events.filter((event) => event.id !== Number(id));
  }
}
