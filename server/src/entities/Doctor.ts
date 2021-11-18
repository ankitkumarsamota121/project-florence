import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { DoctorPatient } from './DoctorPatient';
import { DoctorRecord } from './DoctorRecord';

@ObjectType()
@Entity()
export class Doctor extends User {
  @Field()
  @Column()
  experience: number;

  @Field()
  @Column()
  specialities: string;

  @Field()
  @Column()
  designation: string;

  @OneToMany(() => DoctorPatient, (dp) => dp.doctor)
  patientConnection: Promise<DoctorPatient[]>;

  @OneToMany(() => DoctorRecord, (dp) => dp.doctor)
  recordConnection: Promise<DoctorRecord[]>;
}
