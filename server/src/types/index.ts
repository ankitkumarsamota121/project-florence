import { Request, Response } from 'express';
// import { Redis } from 'ioredis';
// import { createUserLoader } from './utils/createUserLoader';
// import { createUpdootLoader } from './utils/createUpdootLoader';

export type MyContext = {
  req: Request;
  res: Response;
  payload?: { userId: string; userType: string };
  // userLoader: ReturnType<typeof createUserLoader>;
  // updootLoader: ReturnType<typeof createUpdootLoader>;
};
