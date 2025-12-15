import { growthbook } from 'src/pages/_app';
import ErrorBoundary from '../components/layouts/errorBoundary';
import { getComponentLoader } from './components';
import { getFeatures } from './features';

interface FragmentProps {
  name: string;
  variants?: Record<string, any>;
  props?: Record<string, any>;
}

export const Fragment = ({ name, variants, props }: FragmentProps) => {
  if (!name) return null;

  const features = getFeatures({ provider: growthbook });

  const loader = getComponentLoader(name);
  if (!loader) return null;

  const { Component, id, projectId } = loader();

  const mergedProps = { ...props, ...features };

  return (
    <ErrorBoundary>
      <Component
        data-fragment-component-id={id}
        data-fragment-project-id={projectId}
        data-fragment-component={name}
        {...mergedProps}
        {...variants}
      />
    </ErrorBoundary>
  );
};

export default Fragment;
