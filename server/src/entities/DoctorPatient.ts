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
// import { Doctor } from './Doctor';
import { Patient } from './Patient';

@Entity()
export class DoctorPatient extends BaseEntity {
  @PrimaryColumn()
  doctorId: string;

  @PrimaryColumn()
  patientId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.patientConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: Promise<Doctor>;

  @ManyToOne(() => Patient, (patient) => patient.doctorConnection, {
    primary: true,
  })
  @JoinColumn({ name: 'patientId' })
  patient: Promise<Patient>;
}
