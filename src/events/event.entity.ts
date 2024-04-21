import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from './../auth/user.entity';
import { Expose } from 'class-transformer';
import { PaginationResults } from './../pagination/paginator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Event {
  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  @ApiProperty({
    example: 'Metropole Orkest - Edision Jazz',
    description: 'This is the title of the event',
  })
  name: string;

  @Column()
  @Expose()
  @ApiProperty({
    example: 'Amazing Jazz Concert! Marcus Miller on stage!',
    description: 'This is the description of the event',
  })
  description: string;

  @Column()
  @Expose()
  @ApiProperty({
    example: '2024-04-20',
    description: 'This is the Date of the event',
  })
  when: Date;

  @Column()
  @Expose()
  @ApiProperty({
    example: "1217 JL HILVERSUM",
    description: "The addres of the place where the event is going to take place"
  })
  address: string;

  @Column({ default: false })
  @Expose()
  @ApiProperty({
    example: "False",
    description: "Says if the event has already ended"
  })
  completed: boolean;

  @OneToMany(() => Attendee, attendee => attendee.event, {
    cascade: true,
  })
  @Expose()
  attendees: Attendee[];

  @ManyToOne(() => User, user => user.organized)
  @JoinColumn()
  organizer: User;

  @Column({ nullable: true })
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
