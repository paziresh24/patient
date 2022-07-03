import { convertTimeStampToFormattedTime } from "@/utils/convertTimeStampToFormattedTime";
import { convertTimeStampToPersianDate } from "@/utils/convertTimeStampToPersianDate";
import { BookStatus } from "@/types/bookStatus";
import { CenterType } from "@/types/centerType";

interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime?: string;
    trackingCode: string;
  };
  status: BookStatus;
  centerType: CenterType;
}

export const turnDetailsData = ({ data, status, centerType }: TurnDetailsDataParam) => {
  const { bookTime, trackingCode, waitingTime } = data;
  const dateAndTime = `${convertTimeStampToFormattedTime(
    bookTime
  )} - ${convertTimeStampToPersianDate(bookTime)}`;

  if (centerType === CenterType.consult)
    return [
      { id: 0, name: "زمان ارتباط با پزشک", value: dateAndTime },
      { id: 1, name: "کدپیگیری", value: trackingCode },
    ];

  if (status === BookStatus.expired) return [{ id: 0, name: "زمان نوبت", value: dateAndTime }];

  if (status === BookStatus.visited)
    return [
      { id: 0, name: "زمان نوبت", value: dateAndTime },
      { id: 1, name: "کدپیگیری", value: trackingCode },
    ];

  if (status === BookStatus.notVisited)
    return [
      { id: 0, name: "زمان نوبت", value: dateAndTime },
      {
        id: 1,
        name: `میانگین زمان انتظار در ${centerType === CenterType.clinic ? "مطب" : "بیمارستان"}`,
        value: waitingTime,
      },
      { id: 2, name: "کدپیگیری", value: trackingCode },
    ];

  return [{ id: 0, name: "کدپیگیری", value: trackingCode }];
};
