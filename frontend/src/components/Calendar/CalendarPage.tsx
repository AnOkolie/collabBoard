import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { loaderData } from "../../types/calendar";
const localizer = momentLocalizer(moment);
type props = {
  onSelectSlot?: () => void;
};

export const CalendarPage = ({ onSelectSlot }: props) => {
  const loaderData = useLoaderData() as loaderData;
  const events = loaderData.data.flatMap((card) =>
    card.cards
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task.cardId,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        resource: task,
      })),
  );

  return (
    <div style={{ height: "800px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};
