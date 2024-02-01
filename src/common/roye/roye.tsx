import { PlasmicComponent, PlasmicRootProvider } from '@plasmicapp/loader-nextjs';
import config from 'next/config';
import { PLASMIC } from 'plasmic-init';
import { growthbook } from 'src/pages/_app';
import ErrorBoundary from '../components/layouts/errorBoundary';
import { Components } from './components';
import { getRoyeFeatures } from './royeFeatures';
const { publicRuntimeConfig } = config();

interface RoyeProps {
  name: string;
  variants?: Record<string, any>;
  props?: Record<string, any>;
}

export const Roye = ({ name, variants, props }: RoyeProps) => {
  if (!name) return null;

  const royeFeatures = getRoyeFeatures({ provider: growthbook });

  if (publicRuntimeConfig.PLASMIC_PREVIEW) {
    return (
      <ErrorBoundary>
        <PlasmicRootProvider loader={PLASMIC}>
          <PlasmicComponent
            component={name}
            componentProps={{
              'data-roye-component-id': (Components as any)[name].id,
              'data-roye-component': name,
              'data-roye-project-id': publicRuntimeConfig.PLASMIC_PROJECT_ID,
              ...royeFeatures,
              ...props,
              variants,
            }}
          />
        </PlasmicRootProvider>
      </ErrorBoundary>
    );
  }

  const { Component, id } = (Components as any)?.[name] ?? { Component: <div>Error</div>, id: '' };

  return (
    <ErrorBoundary>
      <Component
        data-roye-component-id={id}
        data-roye-project-id={publicRuntimeConfig.PLASMIC_PROJECT_ID}
        data-roye-component={name}
        {...{ ...royeFeatures, ...props, ...variants }}
      />
    </ErrorBoundary>
  );
};

export default Roye;
