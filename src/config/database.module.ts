import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './../auth/profile.entity';
import { User } from './../auth/user.entity';
import { Attendee } from './../events/attendee.entity';
import { Event } from './../events/event.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

(async function () {
  try {
    const envPath = path.resolve(process.cwd(), `${process.env.NODE_ENV.trim()}.env`).replaceAll('\\', '/');

    console.log(dotenv.config({ path: envPath }));
    dotenv.config({ path: envPath });
    dotenv.configDotenv({ path: envPath });
  } catch (error) {
    console.error(error);
  }
})();

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'eventosdb',
    port: Number(process.env.DB_PORT) || 3007,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Profile, User],
    synchronize: process.env.NODE_ENV !== 'prod',
    dropSchema: Boolean(process.env.NODE_ENV === 'e2e' && false),
    }),
  ],
})
export class DatabaseModule {}