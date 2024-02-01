export const getRoyeFeatures = ({ provider }: { provider: any }) => {
  const getRoyeFeaturesFromGrowthbook = Object.keys(provider.getFeatures()).filter(item => item.startsWith('roye::'));
  const royeFeatures = getRoyeFeaturesFromGrowthbook.reduce((previous, current) => {
    return {
      ...previous,
      [current.replace('roye::', '')]: provider.isOn(current),
    };
  }, {});

  return royeFeatures;
};
