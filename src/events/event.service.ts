import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.event';
import { Paginate, PaginationResults, PaginationsOptions } from './../pagination/paginator';
import { Event, PaginatedEvents } from './event.entity';
import { CreateEventDto } from './input/createEvents.dto';
import { User } from './../auth/user.entity';
import { UpdateEventDto } from './input/updateEvent.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  public async getEventsQuery(id: number): Promise<Event> {
    return await this.eventsRepository.createQueryBuilder('e').where('id = :id', { id }).getOne();
  }

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository.createQueryBuilder('e').delete().where('id = :id', { id }).execute();
  }

  public async updateEvent(input: UpdateEventDto, event: Event): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : event.when,
      }),
    );
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...input,
        organizer: user,
        when: new Date(input.when),
      }),
    );
  }

  private getEventWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap('e.attendeeAccepted', 'e.attendees', 'attendee', qb => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Accepted }))
      .loadRelationCountAndMap('e.attendeeMaybe', 'e.attendees', 'attendee', qb => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Maybe }))
      .loadRelationCountAndMap('e.attendeeRejected ', 'e.attendees', 'attendee', qb => qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Rejected }))
      .loadRelationCountAndMap('e.attendeeLessThanFive', 'e.attendees', 'attendee', qb => {
        return qb.andWhere('attendee.id IS NOT NULL').andWhere('attendee.id < 5');
      });
  }

  public async getEventWithAttendeeCount(id: number): Promise<Event> {
    const query = this.getEventWithAttendeeCountQuery().andWhere('e.id = :id', { id });

    this.logger.debug(query.getSql());

    return query.getOne();
  }

  public async findOne(id: number): Promise<Event> {
    return await this.eventsRepository.findOne({
      where: { id },
    });
  }

  private getEventsAttendeeCountFilteredQuery(
    filter?: ListEvents
  ): SelectQueryBuilder<Event> {
    let query = this.getEventWithAttendeeCountQuery();

    if (!filter) return query;

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) query = query.andWhere(`e.when = CURDATE()`);

      if (filter.when == WhenEventFilter.Tomorrow) query = query.andWhere(`e.when > CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`);

      if (filter.when == WhenEventFilter.ThisWeek) query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);

      if (filter.when == WhenEventFilter.NextWeek) query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(DATE_ADD(CURDATE(), INTERVAL 1 WEEK), 1)`)

      if (filter.when == WhenEventFilter.ThisMonth) query = query.andWhere(`MONTH(e.when) = MONTH(CURDATE()) AND YEAR(e.when) = YEAR(CURDATE())`);

      if (filter.when == WhenEventFilter.NextMonth) query = query.andWhere(`MONTH(e.when) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH))`);

      if (filter.when == WhenEventFilter.ThisYear) query = query.andWhere(`YEAR(e.when) = YEAR(CURDATE())`);

      if (filter.when == WhenEventFilter.NextYear) query = query.andWhere(`YEAR(e.when) = YEAR(DATE_ADD(CURDATE(), INTERVAL 1 YEAR))`);

      return query;
    }
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginationsOptions
  ): Promise<PaginatedEvents> {
    return await Paginate(
      this.getEventsAttendeeCountFilteredQuery(filter),
      paginateOptions
    );
  }

  public async getEventsOrganizedByUserIdPaginated(userId: number, paginateOptions: PaginationsOptions): Promise<PaginatedEvents> {
    return await Paginate<Event>(this.getEventsOrganizedByUserIdQuery(userId), paginateOptions);
  }

  private getEventsOrganizedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    const query = this.getEventsBaseQuery().where('e.organizerId = :userId', { userId });

    return query;
  }

  public async getEventsAttendedByUserIdPaginated(userId: number, paginateOptions: PaginationsOptions): Promise<PaginatedEvents> {
    return await Paginate<Event>(this.getEventsAttendedByUserIdQuery(userId), paginateOptions);
  }

  private getEventsAttendedByUserIdQuery(userId: number): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery().leftJoinAndSelect('e.attendees', 'a').where('a.userId = :userId', { userId });
  }
}
