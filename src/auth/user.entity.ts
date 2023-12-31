import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

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
  profile: Profile

}