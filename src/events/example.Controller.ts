import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';

@Controller('/practice')
export class ExampleController {
  constructor(
    @InjectRepository(Event)
    private repository: Repository<Event>,
  ) {}

  @Get('/firts')
  async practice() {
    const event = await this.repository.find({
      where: [
        {
          id: MoreThan(2),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 3,
      order: {
        id: 'DESC',
      },
    });

    if (event.length < 1) throw new NotFoundException();
    return event;
  }

  @Get('/second/:id')
  async secondPractice(@Param('id', ParseIntPipe) id) {
    try {
      const event = await this.repository.findOne({
        where: { id },
        relations: ['attendees'],
      });

      if (!event) throw new NotFoundException();

      const attendee = new Attendee();
      // attendee.name = 'Juan Cascade';
      // attendee.event = event;

      event.attendees.push(attendee);
      await this.repository.save(event);

      return event;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/third')
  async thirdPratice() {
    return await this.repository.createQueryBuilder('event').select(['event.id', 'event.name']).orderBy('event.id', 'DESC').getMany();
  }
}
