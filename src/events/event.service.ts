import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AttendeeAnswerEnum } from "./attendee.entity";

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
    .loadRelationCountAndMap('e.attendeeAll', 'e.attendees','attendee',
      (qb)=>qb.andWhere('attendee.id IS NOT NULL')
    )
  }
  
  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id });

    this.logger.debug(query.getSql());

    return query.getOne();
  }
}
