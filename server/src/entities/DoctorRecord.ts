import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Doctor } from './Doctor';
import { Record } from './Record';

@Entity()
export class DoctorRecord extends BaseEntity {
  @PrimaryColumn()
  doctorId: number;

  @PrimaryColumn()
  recordId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.recordConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Promise<Doctor>;

  @ManyToOne(() => Record, (record) => record.doctorConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'recordId' })
  record: Promise<Record>;
}
