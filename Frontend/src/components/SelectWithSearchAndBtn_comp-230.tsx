"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
// import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDownIcon, Loader2, PlusIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";

interface Option {
  value: string;
  label: string;
}

interface SelectWithSearchAndBtnProps {
  label?: string;
  value: Option | undefined;
  onChange: (value: Option | null) => void;
  options: Option[];
  placeholder?: string;
  navigateTo?: string;
  createBtnName?: string;
  isLoading?: boolean;
  disableOptions?: string[];
}

export default function SelectWithSearchAndBtn({
  label,
  value: propValue,
  onChange,
  options,
  placeholder = "Select...",
  isLoading = false,
  navigateTo,
  createBtnName = "Create",
  disableOptions = [],
}: SelectWithSearchAndBtnProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option | undefined>(
    propValue
  );

  useEffect(() => {
    setSelectedValue(propValue);
  }, [propValue]);

  const handleSelect = (currentValue: Option) => {
    const newValue =
      currentValue.value === selectedValue?.value ? undefined : currentValue;
    setSelectedValue(newValue);
    onChange(newValue ?? null);
    setOpen(false);
  };

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    console.log("Navigate to:", path);

    navigate(path);
  };

  return (
    <div className="*:not-first:mt-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span
              className={cn(
                "truncate",
                !selectedValue && "text-muted-foreground"
              )}
            >
              {selectedValue
                ? options.find((option) => option.value === selectedValue.value)
                    ?.label
                : placeholder}
            </span>
            {isLoading ? (
              <Loader2 size={16} className="animate-spin ml-2" />
            ) : (
              <ChevronDownIcon
                size={16}
                className="text-muted-foreground/80 shrink-0 ml-2"
                aria-hidden="true"
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Find an option" />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isDisabled = disableOptions.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => !isDisabled && handleSelect(option)}
                      className={cn(
                        isDisabled && "opacity-50 pointer-events-none"
                      )}
                    >
                      {option.label}
                      {selectedValue?.value === option.value && (
                        <CheckIcon size={16} className="ml-auto" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {navigateTo && createBtnName && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      onClick={() => handleNavigation(`/${navigateTo}`)}
                    >
                      <PlusIcon
                        size={16}
                        className="-ms-2 opacity-60"
                        aria-hidden="true"
                      />
                      {createBtnName}
                    </Button>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
