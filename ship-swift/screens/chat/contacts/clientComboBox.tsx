"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@clerk/nextjs";
import { onSubmitAsClient } from "@/app/utils/submitRequest";

type Props = {
  drivers: any;
};

export function clientComboBox({ drivers }: Props) {
  const user = useAuth();
  const userId = user.userId;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <UserPlus />
          {/* <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search contact..." />
          <CommandList>
            <CommandEmpty>No contact found.</CommandEmpty>
            <CommandGroup>
              {drivers.map((contact: any) => (
                <CommandItem
                  key={contact.Id}
                  value={contact.fullName}
                  onSelect={(receiver) => {
                    // setValue(currentValue === value ? "" : currentValue);
                    onSubmitAsClient(receiver);

                    setOpen(false);
                  }}
                >
                  {contact.fullName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
