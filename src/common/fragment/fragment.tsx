import { growthbook } from 'src/pages/_app';
import ErrorBoundary from '../components/layouts/errorBoundary';
import { Components } from './components';
import { getFeatures } from './features';
import pick from 'lodash/pick';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

interface FragmentProps {
  name: string;
  variants?: Record<string, any>;
  props?: Record<string, any>;
}

export const Fragment = ({ name, variants, props }: FragmentProps) => {
  const user_id = useUserInfoStore(state => state.info.id);

  if (!name) return null;
  const features = getFeatures({ provider: growthbook });

  const { Component, id, projectId, propsAllowed } = (Components as any)?.[name] ?? {
    Component: () => <p>Error</p>,
    id: '',
    propsAllowed: [],
  };
  return (
    <ErrorBoundary>
      <Component
        data-fragment-component-id={id}
        data-fragment-project-id={projectId}
        data-fragment-component={name}
        {...{ ...pick({ ...props, ...features }, propsAllowed ?? []), ...variants }}
      />
    </ErrorBoundary>
  );
};

export default Fragment;
