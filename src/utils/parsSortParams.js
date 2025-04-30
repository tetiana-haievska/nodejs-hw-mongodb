import { sortList } from '../constants/index.js';

export const parsSortParams = ({ sortBy = 'name', sortOrder }, sortFields) => {
  const parsedSortOrder = sortList.includes(sortOrder?.toLowerCase())
    ? sortOrder.toLowerCase()
    : sortList[0];

  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : 'name';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};