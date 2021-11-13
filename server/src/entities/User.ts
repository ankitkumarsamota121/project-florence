import { PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export abstract class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  email: string;

  @Column('text')
  password: string;
}
