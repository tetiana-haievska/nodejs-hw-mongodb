import {
    getContacts,
    getContact,
    addContact,
    upsertContact,
    deleteContactById,
  } from '../servises/contacts.js';
  import createHttpError from 'http-errors';
  
  export const getContactsController = async (req, res) => {
    const data = await getContacts();
    res.json({
      status: 200,
      message: ' Successfully found contacts',
      data,
    });
  };
  
  export const getContactsByITController = async (req, res) => {
    const { contactId } = req.params;
  
    const data = await getContact(contactId);
    if (!data) {
      throw createHttpError(404, `Contact with ${contactId} not found`);
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
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
    const { data, isNew } = await upsertContact(contactId, req.body, {
      upsert: true,
    });
    const status = isNew ? 201 : 200;
    const message = isNew
      ? 'Successfully created a contact!'
      : 'Successfully update a contact!';
    res.status(status).json({
      status,
      message,
      data,
    });
  };
  
  export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const { data } = await upsertContact(contactId, req.body);
  
    if (!data) {
      throw createHttpError(404, `Contact with ${contactId} not found`);
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully update a contact!',
      data,
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