import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  
  @Column()
  password: string;
  
  @Column()
  email: string;
  
  @Column()
  firstname: string;
  
  @Column()
  lastname?: String;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile

}