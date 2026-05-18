const blockedQueryAttributesForTopSuggestedConsult = new Set(['doctorName', 'clinicName']);

export const shouldShowTopSuggestedConsult = (queryAttributes: unknown): boolean => {
  if (!Array.isArray(queryAttributes)) return true;

  return !queryAttributes.some(
    attribute => typeof attribute === 'string' && blockedQueryAttributesForTopSuggestedConsult.has(attribute),
  );
};

export default shouldShowTopSuggestedConsult;
