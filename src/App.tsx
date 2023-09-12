import { FC, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  Event as AppointmentEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import { RRule } from "rrule";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

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

const App: FC = () => {
  const [events, setEvents] = useState<AppointmentEvent[]>(() => {
    return occurences.map((date) => ({
      start: date,
      end: new Date(date.getTime() + 1 * 60 * 60 * 1000), // Assuming 1 hour event duration
      title: "Recurring Event",
    }));
  });

  function handleSelectSlot(data: SlotInfo) {
    const momentSelectedDateObj = moment(new Date(data.slots[0]).toISOString());
    console.log("selected date", momentSelectedDateObj.toDate().toISOString());

    setEvents([
      ...events,
      {
        title: "New appoinment",
        start: momentSelectedDateObj.toDate(),
        end: momentSelectedDateObj.add(1, "hours").toDate(),
      },
    ]);
  }

  function handleSelectEvent(appointment: AppointmentEvent) {
    console.log({ appointment });
  }

  return (
    <div>
      <Calendar
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        defaultView="week"
        events={events}
        localizer={localizer}
        style={{ height: "100vh" }}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default App;
