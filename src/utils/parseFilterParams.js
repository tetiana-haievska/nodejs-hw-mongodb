export const parseContactFilterParams = ({ contactType, isFavourite }) => {
    const parsedType = contactType ? contactType : undefined;
    let parsedFavorite;
    if (isFavourite === 'true') parsedFavorite = true;
    else if (isFavourite === 'false') parsedFavorite = false;
    else parsedFavorite = undefined;
  
    return {
      contactType: parsedType,
      isFavourite: parsedFavorite,
    };
  };