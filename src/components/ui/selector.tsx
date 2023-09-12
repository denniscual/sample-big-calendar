import { Select } from "@radix-ui/themes";
import { ComponentProps, ReactNode } from "react";

type SelectorProps = ComponentProps<typeof Select.Root> & {
  items?: { value: string; label: ReactNode }[];
};

export function Selector({ items = [], ...props }: SelectorProps) {
  return (
    <Select.Root {...props}>
      <Select.Trigger />
      <Select.Content>
        {items.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
