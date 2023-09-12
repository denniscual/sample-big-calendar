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
    setEvents([
      ...events,
      {
        title: value.title,
        start: value.start,
        end: value.end,
      },
    ]);
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
        endAccessor="end"
      />
    </div>
  );
}

const dtstartDate = new Date("2023-09-24T16:00:00.000Z");

const rrule = new RRule({
  freq: RRule.WEEKLY,
  byweekday: [RRule.TU],
  dtstart: setPartsToUTCDate(dtstartDate), // See note 1
  tzid: "Pacific/Auckland",
});
const datetimes = rrule.between(new Date("2023-09-1"), new Date("2024-10-30"));
let occurences = datetimes;
occurences = datetimes.map(setUTCPartsToDate);

function setPartsToUTCDate(d: Date) {
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    )
  );
}

function setUTCPartsToDate(d: Date) {
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds()
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
