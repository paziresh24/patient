import Location from './location';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Molecules/Location',
    component: Location
};

const Template = args => (
    <div className="w-96">
        <Location {...args} />
    </div>
);

export const ExampleStory = Template.bind({});
ExampleStory.args = {
    address: 'آدرس: یزد، میدان مهدیه، بلوار آیت الله طالقانی، ساختمان نظام پزشکی طبقه دوم، واحد 21',
    lat: 31.885828,
    lng: 54.348932
};
