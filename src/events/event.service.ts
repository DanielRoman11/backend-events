import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ){ };

  private async getEventsBaseQuery(){
    const query = await this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
    
    this.logger.debug(query.getSql());

    return query.getMany();
  }

  public async getEvent(id: number): Promise<Event> {
    const query = await this.eventsRepository
      .createQueryBuilder()
      .andWhere('e.id = :id', {id})

    this.logger.debug(query.getSql());

    return query.getOne()
  }
}