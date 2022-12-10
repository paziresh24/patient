import Provider from '../src/common/components/layouts/provider';
import '../src/styles/globals.css';
import './rtl.css';

export const decorators = [story => <Provider>{story()}</Provider>];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
  backgrounds: {
    default: 'paziresh24',
    values: [
      {
        name: 'paziresh24',
        value: '#F3F7FA',
      },
      {
        name: 'light',
        value: '#fff',
      },
    ],
  },
  previewTabs: {
    'storybook/docs/panel': { index: -1 },
  },
};
