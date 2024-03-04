import { Repository } from "typeorm";
import { EventsService } from "./event.service"
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Event } from "./event.entity";

describe('EventService', ()=>{
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb
  let deleteQb;

  beforeEach(async ()=>{
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn()
    }

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn()
    }

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
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

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest.spyOn(repository, 'save')
        .mockResolvedValue({id: 1} as Event)
      expect(service.updateEvent({name: 'New name'}, new Event({id: 1}))).resolves.toEqual({id: 1});
      expect(repoSpy).toHaveBeenCalledWith({ id: 1, name: 'New name'})
    })
  });

  describe('deleteEvent', () => {
    it('should delete an event', async() => {
      const createQueryBuilderSpy = jest.spyOn(
        repository, 'createQueryBuilder'
      );
      const deleteSpy = jest.spyOn(
        selectQb, 'delete'
      ).mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(
        deleteQb, 'where'
      ).mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(
        deleteQb, 'execute'
      );
      
      expect(service.deleteEvent(1)).resolves.toBe(undefined);
      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', {id: 1});
      expect(executeSpy).toHaveBeenCalledTimes(1);
    })
  })
});