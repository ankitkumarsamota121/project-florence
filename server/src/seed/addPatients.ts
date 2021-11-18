import { createConnection } from 'typeorm';
import { Doctor } from '../entities/Doctor';
import { DoctorPatient } from '../entities/DoctorPatient';
import { DoctorRecord } from '../entities/DoctorRecord';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';
import path from 'path';
import argon2 from 'argon2';

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

  patientsData.forEach(async (p) => {
    const hashedPassword = await argon2.hash(p.password);
    await Patient.create({ ...p, password: hashedPassword }).save();
  });
};

main();
