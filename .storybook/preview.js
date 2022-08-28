import * as NextImage from 'next/image';
import '../styles/globals.css';

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: props => <OriginalNextImage {...props} unoptimized />,
});

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
