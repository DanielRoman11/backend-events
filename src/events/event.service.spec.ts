import { Repository, createQueryBuilder } from "typeorm";
import { EventsService } from "./event.service"
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Event } from "./event.entity";

describe('EventService', ()=>{
  let service: EventsService;
  let repository: Repository<Event>

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken,
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          }
        }
      ]
    }).compile();

    service = module.get<EventsService>(EventsService)
    repository = module
      .get<Repository<Event>>(
        getRepositoryToken(Event)
      )
  });

  describe('updateEvent', ()=>{
    it('should update an event', ()=>{
      const repoSpy = jest.spyOn(repository, 'save')
        .mockResolvedValue({id: 1} as Event);
      
      expect(service.updateEvent(new Event({id: 1}), {id: 1})).resolves.toEqual({ id: 1})
      expect(repoSpy).toHaveBeenCalledWith({id: 1});
    });
  });
});