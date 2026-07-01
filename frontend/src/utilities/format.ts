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
