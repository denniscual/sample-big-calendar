import format from "date-fns/format";
import parse from "date-fns/parse";
import addMinutes from "date-fns/addMinutes";
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import { Selector } from "@/components/ui/selector";

type TimeSelectorProps = {
  date: Date;
  onTimePickerChange?: (date: Date) => void;
};
export function TimeSelector({ date, onTimePickerChange }: TimeSelectorProps) {
  const timeSlots = generateTimeSlots().map((slot) => ({
    label: slot,
    value: slot,
  }));

  // Determine the current time slot from the given date
  const currentTimeSlot = format(date, "hh:mm a");

  const handleValueChange = (value: string) => {
    // Parse the selected time and update the currentDate's time part
    const parsedTime = parse(value, "hh:mm a", new Date());
    const updatedDate = setHours(
      setMinutes(date, parsedTime.getMinutes()),
      parsedTime.getHours()
    );
    onTimePickerChange?.(updatedDate);
  };

  return (
    <Selector
      value={currentTimeSlot}
      onValueChange={handleValueChange}
      items={timeSlots}
    />
  );
}

const generateTimeSlots = (interval = 60) => {
  const slots: string[] = [];
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (let i = 0; i < 24 * 60; i += interval) {
    slots.push(format(current, "hh:mm a"));
    current = addMinutes(current, interval);
  }

  return slots;
};
