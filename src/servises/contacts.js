import ContactColection from '../db/models/contact.js';

export const getContacts = () => ContactColection.find();
export const getContact = (contactId) =>
  ContactColection.findOne({ _id: contactId });

export const addContact = (payload) => ContactColection.create(payload);

export const upsertContact = async (contactId, payload, option = {}) => {
  const { upsert } = option;
  const rawResult = await ContactColection.findByIdAndUpdate(
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
  ContactColection.findOneAndDelete({ _id: contactId });
