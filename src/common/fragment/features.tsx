import camelCase from 'lodash/camelCase';

export const getFeatures = ({ provider }: { provider: any }) => {
  const getFeaturesFromGrowthbook = Object.keys(provider.getFeatures())
    .filter(item => item.startsWith('fragment::'))
    .map(item => ({
      name: item,
      type: typeof provider.getFeatures()[item].defaultValue === 'boolean' ? 'boolean' : 'value',
    }));

  const features = getFeaturesFromGrowthbook.reduce((previous, current) => {
    return {
      ...previous,
      [camelCase(current.name.replace('fragment::', ''))]:
        current.type === 'value' ? provider.getFeatureValue(current.name) : provider.isOn(current.name),
    };
  }, {});

  return features;
};
