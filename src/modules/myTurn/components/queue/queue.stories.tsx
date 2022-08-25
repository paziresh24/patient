import { QueryClientProvider } from 'react-query';
import Queue from './queue';
import { queryClient } from '../../../pages/_app';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/Queue',
    component: Queue
};

const Template = args => (
    <div className="w-[35rem]">
        <QueryClientProvider client={queryClient}>
            <Queue {...args} />
        </QueryClientProvider>
    </div>
);

export const Simple = Template.bind({});
Simple.args = {
    bookId: '123'
};
