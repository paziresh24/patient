import Timer from '../../atoms/timer/timer';
import TurnDetails from './turnDetails';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Molecules/Turn Details',
  component: TurnDetails,
};

const Template = args => (
  <div className="w-96">
    <TurnDetails {...args} />
  </div>
);

export const TrackingCode = Template.bind({});
TrackingCode.args = {
  items: [{ id: 0, name: 'کدپیگیری', value: '123' }],
};

export const Multiple = Template.bind({});
Multiple.args = {
  items: [
    { id: 0, name: 'زمان نوبت', value: '1400/12/23 - 20:45' },
    { id: 1, name: 'میانگین زمان انتظار در مطب', value: '2 ساعت' },
    { id: 2, name: 'کدپیگیری', value: '1234567890' },
  ],
};

export const WithTimer = Template.bind({});
WithTimer.args = {
  items: [
    { id: 1, name: 'میانگین زمان انتظار در مطب', value: '2 ساعت' },
    { id: 2, name: 'کدپیگیری', value: '1234567890' },
    { id: 0, name: 'زمان باقی مانده برای صحبت با پزشک', value: <Timer target={1649750089} /> },
  ],
};
