export const newApiFeatureFlaggingCondition = (feature: string[], value: string) => {
  return feature.includes(value) || feature?.includes('*');
};
