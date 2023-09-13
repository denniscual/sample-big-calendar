import { useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  Event as CalendarEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { RRule } from "rrule";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { Dialog } from "@radix-ui/themes";
import {
  AppointmentDialogContentForm,
  AppointmentEvent,
} from "./appointment-dialog-content-form";
import { setUTCPartsToDate } from "./utils/dates";
import { addHours } from "date-fns";

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const isOpenAppointmentDialog = !!selectedSlot;

  function handleSelectSlot(data: SlotInfo) {
    setSelectedSlot(data);
  }

  function handleSelectEvent(appointment: AppointmentEvent) {
    console.log({ appointment });
  }

  function handleSubmit(value: AppointmentEvent) {
    const { rrule } = value;
    const DURATION = 1;

    const occurencesWithEvent = rrule
      .all()
      .map(setUTCPartsToDate)
      .map((date) => {
        return {
          title: value.title,
          start: date,
          end: addHours(date, DURATION),
        };
      });

    setEvents([...events, ...occurencesWithEvent]);
    return;
  }

  return (
    <div>
      <Dialog.Root
        onOpenChange={(open) => {
          if (open) return;
          setSelectedSlot(null);
        }}
        open={isOpenAppointmentDialog}
      >
        {selectedSlot ? (
          <AppointmentDialogContentForm
            onSubmit={handleSubmit}
            initialValue={{
              title: "",
              start: selectedSlot.slots[0],
            }}
          />
        ) : null}
      </Dialog.Root>
      <Calendar
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        defaultView="week"
        events={events as any}
        localizer={localizer}
        style={{ height: "100vh" }}
        startAccessor="start"
        endAccessor={"end" as any}
      />
    </div>
  );
}

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

console.log({ RRule });
