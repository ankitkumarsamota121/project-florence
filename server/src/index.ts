import 'reflect-metadata';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { Record } from './entities/Record';
import { HelloResolver } from './resolvers/hello';
import { RecordResolver } from './resolvers/record';
import { UserResolver } from './resolvers/user';
import { Patient } from './entities/Patient';
import { Doctor } from './entities/Doctor';
import { DoctorResolver } from './resolvers/doctor';
import { DoctorPatient } from './entities/DoctorPatient';
import { DoctorRecord } from './entities/DoctorRecord';
import { graphqlUploadExpress } from 'graphql-upload';
import { PatientResolver } from './resolvers/patient';
import { ConsentRequest } from './entities/ConsentRequest';
import { ConsentRequestResolver } from './resolvers/consentRequest';
import { Attachment } from './entities/Attachment';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: 'postgresql://postgres:postgres@localhost:5432/project-florence',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [
      Record,
      Patient,
      Doctor,
      DoctorPatient,
      DoctorRecord,
      ConsentRequest,
      Attachment,
    ],
  });
  await conn.runMigrations();

  // await Post.delete({});

  const app = express();
  app.use(cors());

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  //   const RedisStore = connectRedis(session);
  //   const redis = new Redis(process.env.REDIS_URL);
  //   app.set('trust proxy', 1);
  // app.use(
  //   cors({
  //     origin: 'http://localhost:3000/',
  //     credentials: true,
  //   })
  // );
  //   app.use(
  //     session({
  //       name: COOKIE_NAME,
  //       store: new RedisStore({
  //         client: redis,
  //         disableTouch: true,
  //       }),
  //       cookie: {
  //         maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
  //         httpOnly: true,
  //         sameSite: 'lax', // csrf
  //         secure: __prod__, // cookie only works in https
  //         domain: __prod__ ? '.codeponder.com' : undefined,
  //       },
  //       saveUninitialized: false,
  //       secret: process.env.SESSION_SECRET,
  //       resave: false,
  //     })
  //   );

  const apolloServer = new ApolloServer({
    // uploads: false,
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        RecordResolver,
        UserResolver,
        DoctorResolver,
        PatientResolver,
        ConsentRequestResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      //   userLoader: createUserLoader(),
      //   updootLoader: createUpdootLoader(),
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
