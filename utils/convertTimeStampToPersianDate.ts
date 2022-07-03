export const convertTimeStampToPersianDate = (time: number) => {
  return new Date(time * 1000).toLocaleDateString("fa");
};

export default convertTimeStampToPersianDate;
