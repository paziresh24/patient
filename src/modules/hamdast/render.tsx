import { Components } from 'hamdast';
import pick from 'lodash/pick';

interface HamdastProps {
  id: string;
  backendData?: any;
  profileData: Record<string, any>;
  widgetData: Record<string, any>;
}

export const Hamdast = ({ id, backendData, profileData, widgetData }: HamdastProps) => {
  if (!id) return null;

  const { Component, component_id, project_id, props_allowed } = (Components as any)?.[id] ?? {
    Component: () => null,
    id: '',
    propsAllowed: [],
  };

  return (
    <Component
      data-fragment-component-id={component_id}
      data-fragment-project-id={project_id}
      data-fragment-component={id}
      {...{ ...pick({ data: backendData, profileData, widgetData }, props_allowed ?? []) }}
    />
  );
};

export default Hamdast;
