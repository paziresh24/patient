import TagStatus from './tagStatus';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/TagStatus',
    component: TagStatus
};

const Template = args => (
    <div className="w-96">
        <TagStatus {...args} />
    </div>
);

export const Simple = Template.bind({});
Simple.args = {
    status: 'deleted'
};
