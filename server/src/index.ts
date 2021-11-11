import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { Record } from './entity/Record';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    url: 'postgresql://postgres:postgres@localhost:5432/elixir',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [Record],
  });
  await conn.runMigrations();

  // await Post.delete({});

  const app = express();

  //   const RedisStore = connectRedis(session);
  //   const redis = new Redis(process.env.REDIS_URL);
  //   app.set('trust proxy', 1);
  //   app.use(
  //     cors({
  //       origin: process.env.CORS_ORIGIN,
  //       credentials: true,
  //     })
  //   );
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
    schema: await buildSchema({
      resolvers: [HelloResolver],
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
    cors: false,
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});
