import { Param, ParseIntPipe, UsePipes, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendee } from "./attendee.entity";
import { Repository } from "typeorm";

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
}