import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Record } from './Record';

@ObjectType()
@Entity()
export class Attachment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  url: string;

  @ManyToOne(() => Record, (record) => record.attachments)
  record: Promise<Record>;
}
