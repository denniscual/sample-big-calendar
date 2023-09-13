import { useState } from "react";
import { RRule } from "rrule";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Selector } from "@/components/ui/selector";
import { TimeSelector } from "./components/time-selector";
import { addHours, format, setMinutes, setSeconds } from "date-fns";
import { RequireKeys } from "@/utils/types";
import { setPartsToUTCDate } from "@/utils/dates";

export type AppointmentEvent = {
  title: string;
  start?: Date;
  end?: Date;
  rrule: RRule;
};

export type AppointmentDialogContentFormProps = {
  initialValue?: Partial<AppointmentEvent>;
  onSubmit?: (value: AppointmentEvent) => void;
};

export function AppointmentDialogContentForm({
  initialValue = {},
  onSubmit,
}: AppointmentDialogContentFormProps) {
  const [value, setValue] = useState<
    RequireKeys<Partial<AppointmentEvent>, "start" | "end" | "title">
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
      end: initialValue.end ?? addHours(startDate, 1),
    };
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
                end: addHours(date, 1),
              });
            }}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="2" weight="bold">
            Repeat
          </Text>
          <Selector
            value={selectedRepeatOption}
            onValueChange={setSelectedRepeatOption}
            items={repeatOptions}
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
              const dtstart = new Date(value.start.toISOString());

              switch (selectedRepeatOption) {
                case RepeatOptions.DAILY: {
                  onSubmit?.({
                    ...value,
                    rrule: new RRule({
                      freq: RRule[selectedRepeatOption],
                      dtstart: setPartsToUTCDate(dtstart),
                      tzid: "Pacific/Auckland",
                      until: new Date("2023-12-30T17:00:00Z"),
                    }),
                  });
                  break;
                }
                case RepeatOptions.WEEKLY: {
                  const rrule = new RRule({
                    freq: RRule[selectedRepeatOption],
                    byweekday: [RRule[format(dtstart, "EEEEEE").toUpperCase()]],
                    dtstart: setPartsToUTCDate(dtstart),
                    tzid: "Pacific/Auckland",
                    until: new Date("2023-12-30T17:00:00Z"),
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
                      dtstart: setPartsToUTCDate(dtstart),
                      count: 1,
                      tzid: "Pacific/Auckland",
                      until: new Date("2023-12-30T17:00:00Z"),
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
