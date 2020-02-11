import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column
} from "typeorm";

export enum PunchType {
  IN = "ENTRADA",
  OUT = "SAIDA"
}
@Entity()
export class Punch {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  type: PunchType;

  @CreateDateColumn()
  createdAt?: Date;
}
