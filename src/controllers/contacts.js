import {
  getContacts,
  getContact,
  addContact,
  upsertContact,
  deleteContactById,
  updateContactById,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { isValidObjectId } from 'mongoose';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query);

  console.log('Sorting Params:', sortParams);

  const filters = parseFilterParams(req.query);

  console.log('Parsed filters:', filters);

  const query = {};
  if (filters.type) query.contactType = filters.type;
  if (filters.isFavourite !== undefined)
    query.isFavourite = filters.isFavourite;

  console.log('MongoDB query filter before passing:', query);

  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    query,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const cleanId = contactId.trim();

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const data = await getContact(cleanId);
  if (!data) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with ID ${cleanId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const { email, contactType, ...rest } = req.body;

  if (!contactType) {
    throw createHttpError(400, 'contactType is required');
  }

  const data = await addContact({ email: email || null, contactType, ...rest });

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
  const cleanId = contactId.trim();

  if (!req.body || Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'Request body cannot be empty');
  }

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const updatedContact = await updateContactById(cleanId, req.body);

  if (!updatedContact) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const cleanId = contactId.trim();

  if (!isValidObjectId(cleanId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const data = await deleteContactById(cleanId);

  if (!data) {
    throw createHttpError(404, `Contact with ID ${cleanId} not found`);
  }

  res.status(204).send();
};
