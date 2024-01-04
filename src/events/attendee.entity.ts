import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";
import { Expose } from "class-transformer";

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
  
  @Column()
  @Expose()
  name: string
  
  @ManyToOne(()=> Event, (event) => event.attendees, {
    nullable: false,
  })
  @JoinColumn()
  @Expose()
  event: Event;
  
  @Column('enum', {
    enum: AttendeeAnswerEnum,
    nullable: false,
    default: AttendeeAnswerEnum.Rejected,
  })
  @Expose()
  answer: AttendeeAnswerEnum;
}
