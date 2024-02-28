import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/auth/profile.entity';
import { User } from 'src/auth/user.entity';
import { Attendee } from 'src/events/attendee.entity';
import { Event } from 'src/events/event.entity';
import * as dotenv from "dotenv";

dotenv.config()

console.log(process.env.DB_NAME);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3307,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Event, Attendee, Profile, User],
      synchronize: process.env.ENVI === 'development'
    })
  ]
})
export class DatabaseModule {}


// type: 'mysql',
// host: process.env.DB_HOST,
// port: Number(process.env.DB_PORT),
// username: process.env.DB_USER,
// password: process.env.DB_PASS,
// database: process.env.DB_NAME,
// entities: [Event, Attendee, Profile, User],
// synchronize: process.env.ENVI === 'development'