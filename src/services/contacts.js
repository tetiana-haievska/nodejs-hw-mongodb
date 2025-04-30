// import ContactCollection from '../db/models/contact.js';

// export const getContacts = () => ContactCollection.find();
// export const getContact = (contactId) =>
//   ContactCollection.findOne({ _id: contactId });

// export const addContact = (payload) => ContactCollection.create(payload);

// export const upsertContact = async (contactId, payload, option = {}) => {
//   const { upsert } = option;

//   const updateContact = await ContactCollection.findByIdAndUpdate(
//     contactId,
//     payload,
//     {
//       new: true,
//       upsert,
//       // includeResultMetadata: true,
//     },
//   );

//   if (!updateContact) return null;

//   return {
//     data: updateContact,
//     isNew: upsert && !updateContact._id.equals(contactId), // не завжди 100% точний варіант, але краще
//   };
// };

// export const updateContactById = async (contactId, payload) => {
//   return await ContactCollection.findByIdAndUpdate(contactId, payload, {
//     new: true,
//   });
// };

// export const deleteContactById = (contactId) =>
//   ContactCollection.findOneAndDelete({ _id: contactId });

import ContactCollection from '../db/models/contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true';
  }

  const totalItems = await ContactCollection.countDocuments(filter);

  const data = await ContactCollection.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(perPage);

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    totalItems,
    ...paginationData,
  };
};

export const getContact = (contactId) => {
  return ContactCollection.findById(contactId);
};

export const addContact = (payload) => {
  return ContactCollection.create(payload);
};

export const upsertContact = async (contactId, payload, option = {}) => {
  const { upsert } = option;
  const updatedContact = await ContactCollection.findByIdAndUpdate(
    contactId,
    payload,
    { new: true, upsert },
  );

  if (!updatedContact) return null;

  return {
    data: updatedContact,
    isNew: upsert && !updatedContact._id.equals(contactId),
  };
};

export const updateContactById = async (contactId, payload) => {
  return ContactCollection.findByIdAndUpdate(contactId, payload, { new: true });
};

export const deleteContactById = (contactId) => {
  return ContactCollection.findByIdAndDelete(contactId);
};
