/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import OtherTimesComponent from './otherTimes';

export default {
  title: 'Booking/Select Time/OtherTimes',
  component: OtherTimesComponent,
};

const Template = args => (
  <div className="w-[40rem]">
    <OtherTimesComponent {...args} />
  </div>
);

export const OtherTimes = Template.bind({});
OtherTimes.args = {
  days: [
    1669581000, 1669753800, 1670013000, 1670185800, 1670358600, 1670617800, 1670790600, 1670963400, 1671222600, 1671395400, 1671568200,
    1671827400, 1672000200, 1672173000, 1672432200, 1672605000, 1672777800, 1673037000, 1673209800, 1673382600, 1673641800, 1673814600,
    1673987400, 1674246600, 1674419400, 1674592200,
  ],
  onSelectDay: dayTimeStamp => {
    return new Promise(res =>
      setTimeout(
        () =>
          res([
            {
              from: 1671251400,
              to: 1671252300,
            },
            {
              from: 1671252300,
              to: 1671253200,
            },
            {
              from: 1671253200,
              to: 1671254100,
            },
            {
              from: 1671254100,
              to: 1671255000,
              workhour_turn_num: 4,
            },
            {
              from: 1671255000,
              to: 1671255900,
              workhour_turn_num: 5,
            },
            {
              from: 1671255900,
              to: 1671256800,
              workhour_turn_num: 6,
            },
            {
              from: 1671256800,
              to: 1671257700,
              workhour_turn_num: 7,
            },
            {
              from: 1671257700,
              to: 1671258600,
              workhour_turn_num: 8,
            },
            {
              from: 1671258600,
              to: 1671259500,
              workhour_turn_num: 9,
            },
            {
              from: 1671259500,
              to: 1671260400,
              workhour_turn_num: 10,
            },
            {
              from: 1671260400,
              to: 1671261300,
              workhour_turn_num: 11,
            },
            {
              from: 1671261300,
              to: 1671262200,
              workhour_turn_num: 12,
            },
            {
              from: 1671262200,
              to: 1671263100,
              workhour_turn_num: 13,
            },
            {
              from: 1671263100,
              to: 1671264000,
              workhour_turn_num: 14,
            },
            {
              from: 1671264000,
              to: 1671264900,
              workhour_turn_num: 15,
            },
            {
              from: 1671264900,
              to: 1671265800,
              workhour_turn_num: 16,
            },
            {
              from: 1669644600,
              to: 1669645200,
              workhour_turn_num: 8,
            },
            {
              from: 1669647000,
              to: 1669647600,
              workhour_turn_num: 12,
            },
            {
              from: 1669648200,
              to: 1669648800,
              workhour_turn_num: 14,
            },
            {
              from: 1669648800,
              to: 1669649400,
              workhour_turn_num: 15,
            },
            {
              from: 1669650000,
              to: 1669650600,
              workhour_turn_num: 17,
            },
            {
              from: 1669650600,
              to: 1669651200,
              workhour_turn_num: 18,
            },
            {
              from: 1669651200,
              to: 1669651800,
              workhour_turn_num: 19,
            },
            {
              from: 1669651800,
              to: 1669652400,
              workhour_turn_num: 20,
            },
            {
              from: 1669652400,
              to: 1669653000,
              workhour_turn_num: 21,
            },
            {
              from: 1669653000,
              to: 1669653600,
              workhour_turn_num: 22,
            },
            {
              from: 1669653600,
              to: 1669654200,
              workhour_turn_num: 23,
            },
            {
              from: 1669654800,
              to: 1669655400,
              workhour_turn_num: 25,
            },
            {
              from: 1669655400,
              to: 1669656000,
              workhour_turn_num: 26,
            },
            {
              from: 1669656000,
              to: 1669656600,
              workhour_turn_num: 27,
            },
          ]),
        1000,
      ),
    );
  },
};
