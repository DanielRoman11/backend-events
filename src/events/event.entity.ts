import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
