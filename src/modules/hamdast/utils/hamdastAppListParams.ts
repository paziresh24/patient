import { growthbook } from 'src/pages/_app';

export const getHamdastAppListParams = (): Record<string, unknown> => {
  if (!growthbook.ready) return {};

  return Object.keys(growthbook.getFeatures()).reduce<Record<string, unknown>>((params, key) => {
    if (!key.startsWith('hamdast::apps::')) return params;

    const appKey = key.replace('hamdast::apps::', '');
    const feature = growthbook.getFeatures()[key];
    const value =
      typeof feature?.defaultValue === 'boolean' ? growthbook.isOn(key) : growthbook.getFeatureValue(key, undefined);

    if (!value) return params;

    params[appKey] = value;
    return params;
  }, {});
};
