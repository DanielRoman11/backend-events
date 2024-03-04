import { Repository, createQueryBuilder } from "typeorm";
import { EventsService } from "./event.service"
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { exec } from "child_process";

describe('EventService', ()=>{
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
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
      selectQb = {
        delete: jest.fn(),
        where: jest.fn(),
        execute: jest.fn(),
        orderBy: jest.fn(),
        leftJoinAndSelect: jest.fn()
      }
  });


  describe('updateEvent', ()=>{
    it('should update the event', async () =>{
      const repoSpy = jest.spyOn(repository, 'save')
        .mockResolvedValue({id: 1} as Event)
      expect(service.updateEvent({name: 'New name'}, new Event({id: 1}))).resolves.toEqual({id: 1});
      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'New name'})
    })
  });
});