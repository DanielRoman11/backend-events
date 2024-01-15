import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";
import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number
  
  @ManyToOne(()=> Event, (event) => event.attendees, {
    nullable: false,
  })
  @JoinColumn({name: 'eventId'})
  @Expose()
  event: Event;

  @Column()
  eventId: number
  
  @Column('enum', {
    enum: AttendeeAnswerEnum,
    nullable: false,
    default: AttendeeAnswerEnum.Rejected,
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(()=> User, (user) => user.attended)
  @JoinColumn({name: 'userId'})
  @Expose()
  user: User;
  
  @Column()
  // @Expose()
  userId: number;
}
