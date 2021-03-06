import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { DoctorPatient } from './DoctorPatient';
import { DoctorRecord } from './DoctorRecord';
import { ConsentRequest } from './ConsentRequest';

@ObjectType()
@Entity()
export class Doctor extends User {
  // @Field()
  // @Column()
  // experience: number;

  @Field()
  @Column()
  specialities: string;

  @Field()
  @Column()
  designation: string;

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field()
  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => DoctorPatient, (dp) => dp.doctor)
  patientConnection: Promise<DoctorPatient[]>;

  @OneToMany(() => DoctorRecord, (dp) => dp.doctor)
  recordConnection: Promise<DoctorRecord[]>;

  @OneToMany(() => ConsentRequest, (cr) => cr.doctor)
  requests: Promise<ConsentRequest[]>;
}
