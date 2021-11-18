import { createConnection } from 'typeorm';
import { Doctor } from '../entities/Doctor';
import { DoctorPatient } from '../entities/DoctorPatient';
import { DoctorRecord } from '../entities/DoctorRecord';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';
import path from 'path';

import doctorsData from '../data/doctors.json';
import patientsData from '../data/patients.json';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: 'postgresql://postgres:postgres@localhost:5432/project-florence',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/seed/*')],
    entities: [Record, Patient, Doctor, DoctorPatient, DoctorRecord],
  });
  await conn.runMigrations();

  for (var i = 0; i < 50; i++) {
    try {
      let d = Math.floor(Math.random() * 5);
      if (d >= 5) d--;
      let p = Math.floor(Math.random() * 10);
      if (p >= 10) p--;
      const doc = await Doctor.findOne({
        where: { email: doctorsData[d].email },
      });
      const pat = await Patient.findOne({
        where: { email: patientsData[p].email },
      });
      await DoctorPatient.create({
        doctorId: await Doctor.getId(doc!),
        patientId: await Patient.getId(pat!),
      }).save();
    } catch (error) {
      console.log(error);
    }
  }
};

main();
