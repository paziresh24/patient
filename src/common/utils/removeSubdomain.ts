export const removeSubdomain = (domain: string) => {
  const parts = domain.split('.');
  if (parts.length > 2) {
    parts.shift();
    return parts.join('.');
  }
  return domain;
};

export default removeSubdomain;
