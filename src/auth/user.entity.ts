import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Event } from "src/events/event.entity";
import { Expose } from "class-transformer";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  
  @Column({ unique: true})
  @Expose()
  username: string;
  
  @Column()
  password: string;
  
  @Column({unique: true})
  @Expose()
  email: string;
  
  @Column()
  @Expose()
  firstname: string;
  
  @Column()
  @Expose()
  lastname?: String;
  
  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;
  
  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];
}