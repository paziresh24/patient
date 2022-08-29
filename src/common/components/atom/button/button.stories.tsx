import React from 'react';
import Button from './button';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Atoms/Button',
  component: Button,
};

const Template = args => (
  <div className="w-96 flex justify-center">
    <Button {...args} />
  </div>
);

export const Simple = Template.bind({});
Simple.args = {
  children: 'این یک دکمه است',
  variant: 'primary',
  size: 'md',
  theme: 'simple',
  block: false,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: 'این یک دکمه است',
  variant: 'secondary',
  size: 'md',
  theme: 'simple',
  block: false,
  icon: (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.65039 8.25C1.65039 6.59315 2.99354 5.25 4.65039 5.25L9.90039 5.25L9.90039 11.25L4.65039 11.25C2.99354 11.25 1.65039 9.90685 1.65039 8.25V8.25Z"
        stroke="#0077DB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.90039 5.24976L10.3037 4.97478C12.9995 3.13672 14.3474 2.21768 15.4 2.74777C15.4234 2.75956 15.4466 2.7718 15.4695 2.7845C16.5004 3.35553 16.5004 4.98694 16.5004 8.24976V8.24976C16.5004 11.5126 16.5004 13.144 15.4695 13.715C15.4466 13.7277 15.4234 13.74 15.4 13.7517C14.3474 14.2818 12.9995 13.3628 10.3037 11.5247L9.90039 11.2498L9.90039 5.24976Z"
        stroke="#0077DB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.9502 11.25L7.42519 11.25L7.42519 14.5125C7.42519 15.196 6.87115 15.75 6.1877 15.75V15.75C5.50424 15.75 4.9502 15.196 4.9502 14.5125L4.9502 11.25Z"
        stroke="#0077DB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 6L16.725 6C17.9676 6 18.975 7.00736 18.975 8.25V8.25C18.975 9.49264 17.9676 10.5 16.725 10.5L16.5 10.5L16.5 6Z"
        stroke="#0077DB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
