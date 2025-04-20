import ContactCollection from '../db/models/contact.js';

export const getContacts = () => ContactCollection.find();
export const getContact = (contactId) =>
  ContactCollection.findOne({ _id: contactId });

export const addContact = (payload) => ContactCollection.create(payload);

export const upsertContact = async (contactId, payload, option = {}) => {
  const { upsert } = option;

  const updateContact = await ContactCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      upsert,
      // includeResultMetadata: true,
    },
  );

  if (!updateContact) return null;

  return {
    data: updateContact,
    isNew: upsert && !updateContact._id.equals(contactId), // не завжди 100% точний варіант, але краще
  };
};

export const updateContactById = async (contactId, payload) => {
  return await ContactCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};

export const deleteContactById = (contactId) =>
  ContactCollection.findOneAndDelete({ _id: contactId });
