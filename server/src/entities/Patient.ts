import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Patient extends User {
  @Field()
  @Column()
  gender: string;

  @Field()
  @Column()
  blood_group: string;
}
