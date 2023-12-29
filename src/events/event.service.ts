import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";
import { ListEvents, WhenEventFilter } from "./list.event";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ){ };

  private getEventsBaseQuery(){
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
  }  

  
  public getEventWithAttendeeCountQuery(){
    return this.getEventsBaseQuery()
    .loadRelationCountAndMap(
      'e.attendeeCount', 'e.attendees'
    )
    .loadRelationCountAndMap(
      'e.attendeeAccepted',
      'e.attendees',
      'attendee',
      (qb) => qb.where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Accepted})
    )
    .loadRelationCountAndMap(
      'e.attendeeMaybe',
      'e.attendees',
      'attendee',
      (qb) => qb.where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Maybe})
    )
    .loadRelationCountAndMap(
      'e.attendeeRejected ',
      'e.attendees',
      'attendee',
      (qb) => qb.where('attendee.answer = :answer', {answer: AttendeeAnswerEnum.Rejected})
    )
    .loadRelationCountAndMap('e.attendeeLessThanFive', 'e.attendees','attendee',
      (qb)=>{ 
        return qb.andWhere('attendee.id IS NOT NULL')
        .andWhere('attendee.id < 5')
      }

    )
  }
  
  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id });

    this.logger.debug(query.getSql());

    return query.getOne();
  }

  public async getEventsAttendeeCountFiltered(filter?: ListEvents){
    let query = this.getEventWithAttendeeCountQuery()

    if(!filter) 
      return query.getMany();

    if(filter.when){
      if(filter.when == WhenEventFilter.Today) 
        query = query.andWhere(`e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`);
      
      if(filter.when == WhenEventFilter.Tomorrow)
        query = query.andWhere(`e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`);

      if(filter.when == WhenEventFilter.ThisWeek) 
        query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`)

      if(filter.when == WhenEventFilter.NextWeek) 
        query = query.andWhere(`YEARWEEK(e.when, 1) > YEARWEEK(CURDATE(), 1)`)

      if(filter.when == WhenEventFilter.ThisMonth) 
        query = query.andWhere(`MONTH(e.when) = MONTH(CURDATE()) AND YEAR(e.when) = YEAR(CURDATE())`)
      
      if(filter.when == WhenEventFilter.NextMonth) 
        query = query.andWhere(`MONTH(e.when) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)) AND YEAR(e.when) = YEAR(CURDATE())`)
      
      if(filter.when == WhenEventFilter.ThisYear) 
        query = query.andWhere(`YEAR(e.when) = YEAR(CURDATE())`)
      
      if(filter.when == WhenEventFilter.NextYear) 
        query = query.andWhere(`YEAR(e.when) = YEAR(DATE_ADD(CURDATE(), INTERVAL 1 YEAR))`)
    }
  }
}
