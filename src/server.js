import express from 'express';
import cors from 'cors';
import contactRouter from './routers/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/contacts', contactRouter);
  app.use('/api/auth', authRouter); // 👈 це має йти до notFoundHandler
  app.use(notFoundHandler);     // 👈 всі маршрути нижче — це "не знайдено"
  app.use(errorHandler);  
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
