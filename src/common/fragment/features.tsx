import camelCase from 'lodash/camelCase';

export const getFeatures = ({ provider }: { provider: any }) => {
  const getFeaturesFromGrowthbook = Object.keys(provider.getFeatures()).filter(item => item.startsWith('fragment::'));
  const features = getFeaturesFromGrowthbook.reduce((previous, current) => {
    return {
      ...previous,
      [camelCase(current.replace('fragment::', ''))]: provider.isOn(current),
    };
  }, {});

  return features;
};
