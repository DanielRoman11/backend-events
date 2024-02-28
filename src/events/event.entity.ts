import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";
import { User } from "./../auth/user.entity";
import { Expose } from "class-transformer";
import { PaginationResults } from "./../pagination/paginator";

@Entity()
export class Event {
  constructor(partial: Partial<Event>){
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  
  @Column()
  @Expose()
  name: string;
  
  @Column()
  @Expose()
  description: string;
  
  @Column({type: "date"})
  @Expose()
  when: Date;
  
  @Column()
  @Expose()
  address: string;
  
  @Column({default: false})
  @Expose()
  completed: boolean;
  
  @OneToMany(()=> Attendee, (attendee) => attendee.event,{
    cascade: true
  })
  @Expose()
  attendees: Attendee[]
  
  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({name: 'organizerId'})
  organizer: User;
  
  @Column({nullable: true})
  organizerId: number;
  
  //* VIRTUAL PROPERTIES
  @Expose()
  attendeeCount?: number;
  @Expose()
  attendeeRejected?: number;
  @Expose()
  attendeeMaybe?: number;
  @Expose()
  attendeeAccepted?: number;
}

export type PaginatedEvents = PaginationResults<Event>;