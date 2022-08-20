import Timer from './timer';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Atoms/Timer',
    component: Timer
};

const Template = args => <Timer {...args} />;

export const ExampleStory = Template.bind({});
ExampleStory.args = {
    target: 1644812530
};
