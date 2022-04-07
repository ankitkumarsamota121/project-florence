import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Record, (record) => record.attachments)
  record: Promise<Record>;
}
