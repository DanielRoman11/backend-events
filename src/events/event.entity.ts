import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";
import { User } from "src/auth/user.entity";

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

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({name: 'organizerId'})
  organizer: User;

  @Column({nullable: true})
  organizerId: number;

  //* VIRTUAL PROPERTIES
  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}
