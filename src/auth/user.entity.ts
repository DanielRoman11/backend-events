import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Event } from "src/events/event.entity";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  username: string;
  
  @Column()
  password: string;
  
  @Column({unique: true})
  email: string;
  
  @Column()
  firstname: string;
  
  @Column()
  lastname?: String;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  organized: Event[];
}