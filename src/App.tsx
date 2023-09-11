import { FC, useState } from "react";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  Event as AppointmentEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from "moment";
import "moment-timezone";
import { RRule } from "rrule";

const rule = new RRule({
  freq: RRule.WEEKLY,
  interval: 1,
  byweekday: [RRule.TU],
  dtstart: new Date(Date.UTC(2023, 8, 1, 5, 0)), // 5am start time. Note: January is 0 in JavaScript Date
  until: new Date(Date.UTC(2023, 9, 31, 6, 0)), // Until end of the year at 6am
  tzid: "Pacific/Auckland",
});

const occurrences = rule.all();

console.log({ occurrences });

const localizer = momentLocalizer(moment);

const App: FC = () => {
  const [events, setEvents] = useState<AppointmentEvent[]>(() => {
    return occurrences.map((date) => ({
      start: date,
      end: new Date(date.getTime() + 1 * 60 * 60 * 1000), // Assuming 1 hour event duration
      title: "Recurring Event",
    }));
  });

  function handleSelectSlot(data: SlotInfo) {
    const momentSelectedDateObj = moment(new Date(data.slots[0]).toISOString());
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
        defaultView="day"
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

// console.log(momentObj.format('dddd, MMMM Do YYYY, h:mm:ss a"'))
// [
//     {
//       title: 'Cleaning',
//       start: moment('2023-09-24T17:00:00Z').toDate(),
//       end: moment('2023-09-24T17:00:00Z').add(1, 'hours').toDate(),
//     },
//   ]
