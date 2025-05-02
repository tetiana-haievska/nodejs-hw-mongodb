import ContactCollection from '../db/models/contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  query = {},
}) => {
  const filter = {};
  if (query.contactType) filter.contactType = query.contactType;
  if (query.isFavourite !== undefined) filter.isFavourite = query.isFavourite;

  console.log('Final MongoDB Query Filter:', filter);

  const skip = (page - 1) * perPage;
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  console.log('Final MongoDB Sort Options:', sortOptions);

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
