import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  description: string;

  @Column({type: "date"})
  when: Date;

  @Column()
  address: string;

  @Column({default: false})
  completed: boolean;

  @OneToMany(()=> Attendee, (attendee) => attendee.event,{
    cascade: true
  })
  attendees: Attendee[]
}
