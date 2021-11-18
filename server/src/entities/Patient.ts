import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { Record } from './Record';
import { DoctorPatient } from './DoctorPatient';

@ObjectType()
@Entity()
export class Patient extends User {
  @Field()
  @Column()
  gender: string;

  @Field()
  @Column()
  blood_group: string;

  @OneToMany(() => Record, (record) => record.patient)
  records: Record[];

  @OneToMany(() => DoctorPatient, (dp) => dp.patient)
  doctorConnection: Promise<DoctorPatient[]>;
}
