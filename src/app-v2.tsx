import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import rrulePlugin from "@fullcalendar/rrule";

export default function AppV2() {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, rrulePlugin]}
      initialView="timeGridWeek"
      weekends={true}
      timeZone="Pacific/Auckland"
      events={[
        {
          title: "Recurrence every Monday and Friday",
          // backgroundColor: "lime",
          rrule: {
            freq: "weekly",
            interval: 1,
            byweekday: ["SU", "MO"],
            dtstart: "2023-09-24T17:00:00Z",
            until: "2029-06-01",
          },
          duration: "01:00",
        },
      ]}
    />
  );
}
