export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const timeString = (timestamp: string) => {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",

    minute: "2-digit",
  });
  return time;
};

export const formatRequestTime = (time: Date) => {
  const timePassed = new Date(Date.now() - time.getDate());
  const hours = timePassed.getHours();
  const min = timePassed.getMinutes();
  const sec = timePassed.getSeconds();
  if (hours >= 24) {
    return `${Math.floor(hours / 24)}d`;
  } else if (hours < 24 && hours > 0) {
    return `${hours}h`;
  } else if (min > 0 && min < 60) {
    return `${min}m`;
  }
  return `${sec}s`;
};
