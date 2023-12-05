import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(()=> Event, (event) => event.attendees, {
    nullable: false,
  })
  event: Event;
}
