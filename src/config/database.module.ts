import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './../auth/profile.entity';
import { User } from './../auth/user.entity';
import { Attendee } from './../events/attendee.entity';
import { Event } from './../events/event.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

(async function() {
  try {
    const envPath = path.resolve(process.cwd(), `${process.env.NODE_ENV.trim()}.env`).replaceAll('\\', '/');

    dotenv.config({ path: envPath });
    dotenv.configDotenv({path: envPath})
  } catch (error) {
    console.error(error);
  }
})();
// console.log(process.env.DB_NAME);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) && 3307,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Event, Attendee, Profile, User],
      synchronize: process.env.NODE_ENV == 'dev',
    }),
  ],
})
export class DatabaseModule {}
