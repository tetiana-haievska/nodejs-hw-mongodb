import {
  getContacts,
  getContact,
  addContact,
  upsertContact,
  deleteContactById,
  updateContactById,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const data = await getContacts();
  res.json({
    status: 200,
    message: ' Successfully found contacts',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const cleanId = contactId.trim();

  const data = await getContact(cleanId);
  if (!data) {
    throw createHttpError(404, `Contact with ${cleanId} not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${cleanId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;

  let isNew = false;
  let data;
  if (contactId) {
    data = await upsertContact(contactId, req.body);
    isNew = false;
  } else {
    data = await addContact(req.body);
    isNew = true;
  }

  // const { data, isNew } = await upsertContact(contactId, req.body, {
  //   upsert: true,
  // });

  const status = isNew ? 201 : 200;
  const message = isNew
    ? 'Successfully created a contact!'
    : 'Successfully updated a contact!';
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body is empty or invalid');
  }
  // const { data } = await upsertContact(contactId, req.body);
  // const {data: updateContact} = await upsertContact(contactId, req.body);
  const updatedContact = await updateContactById(contactId, req.body);

  if (!updatedContact) {
    throw createHttpError(404, `Contact with id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const data = await deleteContactById(contactId);

  if (!data) {
    throw createHttpError(404, `Contact with ${contactId} not found`);
  }

  res.status(204).send();
};
