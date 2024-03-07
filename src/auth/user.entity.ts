import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Event } from './../events/event.entity';
import { Expose } from 'class-transformer';
import { Attendee } from './../events/attendee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstname: string;

  @Column()
  @Expose()
  lastname?: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, event => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, attendee => attendee.user)
  attended: Attendee[];
}
