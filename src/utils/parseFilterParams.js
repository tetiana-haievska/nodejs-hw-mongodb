export const parseFilterParams = ({ contactType, isFavourite }) => {
  const parsedType = contactType ? contactType : undefined;

  const parsedFavorite = isFavourite ? isFavourite === 'true' : undefined;

  return {
    contactType: parsedType,
    isFavourite: parsedFavorite,
  };
};
