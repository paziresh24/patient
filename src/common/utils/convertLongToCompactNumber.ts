export const convertLongToCompactNumber = (number: number) => {
  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  return formater.format(number);
};
