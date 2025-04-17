import ContactCollection from '../db/models/contact.js';

export const getContacts = () => ContactCollection.find();
export const getContact = (contactId) =>
  ContactCollection.findOne({ _id: contactId });

export const addContact = (payload) => ContactCollection.create(payload);

export const upsertContact = async (contactId, payload, option = {}) => {
  const { upsert } = option;
  const rawResult = await ContactCollection.findByIdAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      upsert,
      includeResultMetadata: true,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = (contactId) =>
  ContactCollection.findOneAndDelete({ _id: contactId });
