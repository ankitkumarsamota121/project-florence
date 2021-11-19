import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { Record } from './Record';
import { DoctorPatient } from './DoctorPatient';
import { ConsentRequest } from './ConsentRequest';

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
  records: Promise<Record[]>;

  @OneToMany(() => ConsentRequest, (cr) => cr.patient)
  requests: Promise<ConsentRequest[]>;

  @OneToMany(() => DoctorPatient, (dp) => dp.patient)
  doctorConnection: Promise<DoctorPatient[]>;
}
