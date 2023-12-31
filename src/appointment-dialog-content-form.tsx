import { useState } from "react";
import { RRule } from "rrule";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Selector } from "@/components/ui/selector";
import { TimeSelector } from "@/components/time-selector";
import format from "date-fns/format";
import setMinutes from "date-fns/setMinutes";
import setSeconds from "date-fns/setSeconds";
import { getUTCDate } from "@/utils/date";
import { RequireKeys } from "./utils/types";

export type AppointmentEvent = {
  title: string;
  start: Date;
  duration?: number;
  rrule: RRule;
};

type InitialAppointmentEventValue = Partial<AppointmentEvent>;

export type AppointmentDialogContentFormProps = {
  initialValue?: InitialAppointmentEventValue;
  onSubmit?: (value: AppointmentEvent) => void;
};

export function AppointmentDialogContentForm({
  initialValue = {},
  onSubmit,
}: AppointmentDialogContentFormProps) {
  const [value, setValue] = useState<
    RequireKeys<InitialAppointmentEventValue, "start" | "title">
  >(() => {
    const currentDate = new Date();
    const startDate = setSeconds(
      setMinutes(initialValue.start ?? currentDate, 0),
      0
    );
    return {
      ...initialValue,
      title: initialValue.title ?? "",
      start: startDate,
      duration: initialValue.duration ?? 1,
    };
  });

  const rruleRepeatOptions = repeatOptions.map((option) => {
    if (option.value === RepeatOptions.WEEKLY) {
      return {
        value: option.value,
        label: `Weekly on ${format(value.start, "EEEE")}`,
      };
    }
    return option;
  });

  const [selectedRepeatOption, setSelectedRepeatOption] = useState(
    RepeatOptions.NO_REPEAT
  );

  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Dialog.Title>Schedule new appointment</Dialog.Title>
      <Flex direction="column" gap="4">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Title
          </Text>
          <TextField.Input
            name="title"
            value={value.title}
            onChange={(event) => {
              setValue({
                ...value,
                title: event.target.value,
              });
            }}
          />
        </label>
        <label>
          <Text as="div" size="2" weight="bold" mb="1">
            Date
          </Text>
          <Text as="div" size="2" mb="2">
            {format(value.start, "ccc, LLLL d")}
          </Text>
          <TimeSelector
            date={value.start}
            onTimePickerChange={(date) => {
              setValue({
                ...value,
                start: date,
              });
            }}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="2" weight="bold">
            Appointment Duration (Hour)
          </Text>
          <TextField.Input
            min={0}
            value={value.duration}
            onChange={(event) => {
              const { target } = event;
              setValue({
                ...value,
                duration: parseInt(target.value),
              });
            }}
            type="number"
            placeholder="E.g 1 hour duration"
          />
        </label>
        <label>
          <Text as="div" size="2" mb="2" weight="bold">
            Repeat
          </Text>
          <Selector
            value={selectedRepeatOption}
            onValueChange={setSelectedRepeatOption}
            items={rruleRepeatOptions}
          />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button
            onClick={() => {
              const dtstart = getUTCDate(value.start);
              const until = new Date("2024-12-30T17:00:00Z");

              switch (selectedRepeatOption) {
                case RepeatOptions.DAILY: {
                  onSubmit?.({
                    ...value,
                    rrule: new RRule({
                      freq: RRule[selectedRepeatOption],
                      dtstart,
                      until,
                    }),
                  });
                  break;
                }
                case RepeatOptions.WEEKLY: {
                  const rrule = new RRule({
                    freq: RRule[selectedRepeatOption],
                    byweekday: [RRule[format(dtstart, "EEEEEE").toUpperCase()]],
                    dtstart,
                    until,
                  });
                  onSubmit?.({
                    ...value,
                    rrule,
                  });
                  break;
                }
                default: {
                  onSubmit?.({
                    ...value,
                    rrule: new RRule({
                      dtstart,
                      count: 1,
                      until,
                    }),
                  });
                }
              }
            }}
          >
            Save
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
}

const RepeatOptions = {
  NO_REPEAT: "NO_REPEAT",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
};

const repeatOptions = [
  {
    value: RepeatOptions.NO_REPEAT,
    label: `Don't repeat`,
  },
  {
    value: RepeatOptions.DAILY,
    label: "Daily",
  },
  {
    value: RepeatOptions.WEEKLY,
    label: "Weekly",
  },
];
