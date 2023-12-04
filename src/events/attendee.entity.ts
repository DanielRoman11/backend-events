import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
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
  @JoinColumn({
    name: 'event_id',
  })
  event: Event;
}
