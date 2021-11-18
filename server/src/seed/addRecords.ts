import { createConnection } from 'typeorm';
import { Doctor } from '../entities/Doctor';
import { DoctorPatient } from '../entities/DoctorPatient';
import { DoctorRecord } from '../entities/DoctorRecord';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';
import path from 'path';

import recordsData from '../data/records.json';

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

  const patients = await Patient.find();
  recordsData.forEach(async (r) => {
    try {
      const idx = Math.floor(Math.random() * 10);
      await Record.create({
        ...r,
        patient: patients[idx],
      }).save();
    } catch (error) {
      console.log(error);
    }
  });
};

main();
