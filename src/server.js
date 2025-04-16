import express from 'express';
import cors from 'cors';
// import pino from 'pino-http';
import contactRouter from './rourters/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { getContacts, getContact } from './servises/contacts.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  // app.get('/contacts', async (req, res) => {
  //   const data = await getContacts();
  //   res.json({
  //     status: 200,
  //     message: ' Successfully found contacts',
  //     data,
  //   });
  // });

  // app.get('/contacts/:contactId', async (req, res) => {
  //   const { contactId } = req.params;
  //   try {
  //     const data = await getContact(contactId);
  //     if (!data) {
  //       return res.status(404).json({
  //         message: `Contact ${contactId} not found `,
  //       });
  //     }
  //     res.json({
  //       status: 200,
  //       message: `Successfully found contact with id ${contactId}!`,
  //       data,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // });

  // app.use((req, res) => {
  //   res.status(404).json({
  //     message: `${req.url} not found `,
  //   });
  // });
  app.use('/contacts', contactRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};