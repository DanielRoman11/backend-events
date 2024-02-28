import { Repository, createQueryBuilder } from "typeorm";
import { EventsService } from "./event.service"
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

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
      .get<Repository<Event>>(getRepositoryToken(Event))
  });
})