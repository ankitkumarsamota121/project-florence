import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Doctor extends User {
  @Field()
  @Column()
  experience: string;

  @Field()
  @Column()
  specialities: string;

  @Field()
  @Column()
  designation: string;
}
