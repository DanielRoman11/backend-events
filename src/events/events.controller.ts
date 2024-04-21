import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/createEvents.dto';
import { UpdateEventDto } from './input/updateEvent.dto';
import { EventsService } from './event.service';
import { ListEvents } from './input/list.event';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller({ path: '/events' })
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventService.getEventsWithAttendeeCountFilteredPaginated(filter, {
      totalPages: true,
      currentPage: filter.page,
      limit: 2,
    });

    return events;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventService.getEventWithAttendeeCount(id);
    if (!event) throw new NotFoundException();

    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(202)
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto, @CurrentUser() user: User) {
    const event = await this.eventService.findOne(id);

    if (!event) throw new NotFoundException();

    if (event.organizerId !== user.id) throw new ForbiddenException();

    return await this.eventService.updateEvent(input, event);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventService.findOne(id);
    if (!event) throw new NotFoundException();

    if (event.organizerId !== user.id) throw new ForbiddenException();

    const result = await this.eventService.deleteEvent(id);
    return result.affected;
  }
}
