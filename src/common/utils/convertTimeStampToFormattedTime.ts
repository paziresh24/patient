export const convertTimeStampToFormattedTime = (time: number) => {
  const date = new Date(time * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${hours}:${minutes.toString().length === 1 ? `0${minutes}` : minutes}`;
  return timeString;
};

export default convertTimeStampToFormattedTime;
