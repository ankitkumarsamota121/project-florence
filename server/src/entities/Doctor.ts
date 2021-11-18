import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
// import { Patient } from './Patient';
import { Record } from './Record';
import { DoctorPatient } from './DoctorPatient';

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

  @OneToMany(() => DoctorPatient, (dp) => dp.doctor)
  patientConnection: Promise<DoctorPatient[]>;

  @ManyToMany(() => Record, (record) => record.doctors)
  @JoinTable()
  records: Record[];
}
