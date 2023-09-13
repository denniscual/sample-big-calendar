import { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  SlotInfo,
  Event as CalendarEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import addHours from "date-fns/addHours";
import { Button, Card, Dialog, Flex, Text } from "@radix-ui/themes";
import {
  AppointmentDialogContentForm,
  AppointmentEvent,
} from "./appointment-dialog-content-form";
import { getLocalDate } from "@/utils/date";
import { Selector } from "@/components/ui/selector";
import timeZoneJSON from "@/assets/timeZone.json";

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

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    () => new Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const timeZoneOptions = useMemo(
    () =>
      timeZoneJSON.map((timeZone) => ({
        label: timeZone,
        value: timeZone,
      })),
    []
  );
  const isOpenAppointmentDialog = !!selectedSlot;

  function handleSelectSlot(data: SlotInfo) {
    setSelectedSlot(data);
  }

  function handleSubmit(value: AppointmentEvent) {
    const { rrule, title, duration } = value;

    const occurencesWithEvent = rrule
      .all()
      .map(getLocalDate)
      .map((date) => {
        return {
          title: title,
          start: date,
          end: addHours(date, !duration || isNaN(duration) ? 1 : duration),
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
        events={events}
        localizer={localizer}
        style={{ height: "100vh" }}
        startAccessor="start"
        endAccessor={"end"}
      />
      <div
        style={{
          height: 200,
        }}
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
            maxWidth: 500,
            margin: "auto",
            height: "100%",
          }}
        >
          <Flex gap="3" align="center" height="100%" justify="between">
            <Flex gap="2" asChild align="center" width="100%">
              <label>
                <Text as="div" size="2" weight="bold">
                  Change Timezone
                </Text>

                <Selector
                  disabled
                  value={selectedTimeZone}
                  onValueChange={setSelectedTimeZone}
                  items={timeZoneOptions}
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
                navigator.clipboard.writeText(JSON.stringify(data));
              }}
            >
              Copy to clipboard
            </Button>
          </Flex>
        </Card>
      </footer>
    </div>
  );
}
