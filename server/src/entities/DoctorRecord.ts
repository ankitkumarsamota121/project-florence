import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './Doctor';
import { Record } from './Record';

@Entity()
export class DoctorRecord extends BaseEntity {
  @PrimaryColumn()
  doctorId: string;

  @PrimaryColumn()
  recordId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

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
