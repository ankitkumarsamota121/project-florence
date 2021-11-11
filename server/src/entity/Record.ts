import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;
  // doctor: string;

  @Column()
  category: string;
  // attachment: string;

  @Column()
  description: string;
}
