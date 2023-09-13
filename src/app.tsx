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
import { Button, Card, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import {
  AppointmentDialogContentForm,
  AppointmentEvent,
} from "./appointment-dialog-content-form";
import { setUTCPartsToDate } from "./utils/dates";
import { addHours } from "date-fns";

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [appointmentDuration, setAppointmentDuration] = useState(1);

  const isOpenAppointmentDialog = !!selectedSlot;

  function handleSelectSlot(data: SlotInfo) {
    setSelectedSlot(data);
  }

  function handleSubmit(value: AppointmentEvent) {
    const { rrule } = value;

    const occurencesWithEvent = rrule
      .all()
      .map(setUTCPartsToDate)
      .map((date) => {
        return {
          title: value.title,
          start: date,
          end: addHours(date, appointmentDuration),
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
        selectable
        defaultView="week"
        events={events as any}
        localizer={localizer}
        style={{ height: "100vh" }}
        startAccessor="start"
        endAccessor={"end" as any}
      />
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          height: 100,
          width: "100%",
          backgroundColor: "#fafafa",
          boxShadow: "1px -1px #d7d7d7",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        <Card
          style={{
            maxWidth: 800,
            margin: "auto",
            height: "100%",
          }}
        >
          <Flex gap="3" align="center" height="100%" justify="between">
            <Flex gap="2" asChild align="center" width="100%">
              <label>
                <Text as="div" size="2" weight="bold">
                  Appointment Duration
                </Text>
                <TextField.Input
                  value={appointmentDuration}
                  onChange={(event) =>
                    setAppointmentDuration(parseInt(event.target.value))
                  }
                  type="number"
                  placeholder="E.g 1 hour duration"
                />
              </label>
            </Flex>
            <Flex gap="2" asChild align="center" width="100%">
              <label>
                <Text as="div" size="2" weight="bold">
                  Change Timezone
                </Text>
                <TextField.Input
                  defaultValue="Freja Johnsen"
                  placeholder="Enter your full name"
                />
              </label>
            </Flex>
            <Button
              onClick={() => {
                const data = {
                  appointments: events.map((event) => ({
                    ...event,
                    start: event.start?.toISOString(),
                    end: event.end?.toISOString(),
                  })),
                };
                alert(JSON.stringify(data));
              }}
            >
              Show appointments
            </Button>
          </Flex>
        </Card>
      </footer>
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
