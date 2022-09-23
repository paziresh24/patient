export const removeHtmlTagInString = (str: string) => {
  return str.replace(/(<([^>]+)>)/gi, '');
};
