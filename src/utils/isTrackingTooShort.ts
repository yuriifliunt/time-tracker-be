export const isTrackingTooShort = (startTime: Date): boolean => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - new Date(startTime).getTime();
  return timeDifference < 15 * 60 * 1000;
};
