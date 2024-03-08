import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { DataSource } from "typeorm";
import * as fs from 'fs/promises';
import * as path from 'path';

let app: INestApplication;
let mod: TestingModule;
let connection: DataSource;

const loadFixtures = async (sqlFileName: string) =>{
const sql = fs.readFile(path.join(__dirname, 'fixtures', 'sqlFileName'), 'utf8');
}

describe('Events (e2e)', () => {
  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = mod.createNestApplication();
    await app.init();

    connection = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an empty list of events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200);
  });
});