import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { Repository } from "typeorm";
import { CreateAttendeeDto } from "./input/createAttendee.dto";

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>
  ) { }

  /**
   * getAttendee
   */
  public async findByEventId(eventId: number): Promise<Attendee> {
    const query = this.attendeeRepository
      .createQueryBuilder('a')
      .where('a.id = :id', {eventId})

    return query.getOne()
  }

  public async findOneByEventIdAndUserId(userId: number, eventId: number): Promise<Attendee | undefined>{
    const query = await this.attendeeRepository.findOneBy({
      event: {id: eventId},
      user: {id: userId}
    });
    
    return query
  }

  public async createOrUpdate(input: CreateAttendeeDto, eventId: number, userId: number): Promise<Attendee>{
    const attende = await this.findOneByEventIdAndUserId(userId, eventId) ?? new Attendee()

    attende.eventId = eventId;
    attende.userId = userId;
    attende.answer = input.answer;
    
    return await this.attendeeRepository.save(attende);
  }
}
