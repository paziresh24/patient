import { PlasmicComponent, PlasmicRootProvider } from '@plasmicapp/loader-nextjs';
import config from 'next/config';
import { PLASMIC } from 'plasmic-init';
import { growthbook } from 'src/pages/_app';
import ErrorBoundary from '../components/layouts/errorBoundary';
import { Components } from './components';
import { getFeatures } from './features';
const { publicRuntimeConfig } = config();
import pick from 'lodash/pick';

interface FragmentProps {
  name: string;
  variants?: Record<string, any>;
  props?: Record<string, any>;
}

export const Fragment = ({ name, variants, props }: FragmentProps) => {
  if (!name) return null;

  const features = getFeatures({ provider: growthbook });

  if (publicRuntimeConfig.PLASMIC_PREVIEW) {
    return (
      <ErrorBoundary>
        <PlasmicRootProvider loader={PLASMIC}>
          <PlasmicComponent
            component={name}
            componentProps={{
              'data-fragment-component-id': (Components as any)?.[name]?.id,
              'data-fragment-component': name,
              'data-fragment-project-id': publicRuntimeConfig.PLASMIC_PROJECT_ID,
              variants,
              ...features,
              ...props,
            }}
          />
        </PlasmicRootProvider>
      </ErrorBoundary>
    );
  }

  const { Component, id, propsAllowed } = (Components as any)?.[name] ?? { Component: () => <p>Error</p>, id: '', propsAllowed: [] };
  return (
    <ErrorBoundary>
      <Component
        data-fragment-component-id={id}
        data-fragment-project-id={publicRuntimeConfig.PLASMIC_PROJECT_ID}
        data-fragment-component={name}
        {...{ ...pick({ ...props, ...features }, propsAllowed ?? []), ...variants }}
      />
    </ErrorBoundary>
  );
};

export default Fragment;
