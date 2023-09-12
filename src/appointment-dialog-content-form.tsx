import { useState } from "react";
import { RRule } from "rrule";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { Selector } from "@/components/ui/selector";
import { TimeSelector } from "./components/time-selector";
import { addHours, format, setMinutes, setSeconds } from "date-fns";
import { RequireKeys } from "./utils/types";

export type AppointmentEvent = {
  title: string;
  start?: Date;
  end?: Date;
  rrule?: RRule;
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
    RequireKeys<AppointmentEvent, "start" | "end">
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
            defaultValue="no-repeat"
            items={[
              {
                value: "no-repeat",
                label: `Don't repeat`,
              },
            ]}
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
              // TODO:
              // - handle rrule here.
              onSubmit?.(value);
            }}
          >
            Save
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
}
