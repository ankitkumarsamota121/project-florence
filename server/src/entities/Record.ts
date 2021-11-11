import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Record {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ length: 40 })
  title: string;
  // doctor: string;

  @Field()
  @Column()
  category: string;
  // attachment: string;

  @Field()
  @Column()
  description: string;
}
