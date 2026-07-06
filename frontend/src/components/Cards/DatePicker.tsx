import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { Group, Text } from "@mantine/core";

export const ProductionDatePicker = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Group m={"md"}>
      {/* <Text>Task Due date</Text> */}
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => {
          if (date) setStartDate(date);
        }}
        showTimeSelect
        timeFormat="HH:mm"
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
        filterDate={(date: Date) => date.getDay() !== 0 && date.getDay() !== 6}
      />
    </Group>
  );
};
