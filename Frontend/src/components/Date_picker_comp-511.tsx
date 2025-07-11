"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

export default function Date_picker({
  value,
  onChange,
  resetKey,
}: {
  value: Date | null;
  onChange: (value: Date | null) => void;
  resetKey: number;
}) {
  const id = useId();
  const [date, setDate] = useState<Date | null>(value);

  useEffect(() => {
    console.log("📅 useEffect triggered - Received value:", value);

    if (value instanceof Date && !isNaN(value.getTime())) {
      console.log("✅ Setting state date to:", value);
      setDate(value); // ✅ Explicitly setting it
    } else {
      console.log("❌ Invalid date, setting state to null");
      setDate(null);
    }
  }, [value]);
  console.log("Type of value: ", typeof value);
  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setDate(value);
    } else {
      setDate(null);
    }
  }, [resetKey, value]);
  console.log("📅 Rendered Date_picker - Value prop:", value);
  console.log("📅 Rendered Date_picker - State date (before setting):", date);
  const handleDateChange = (selectedDate: Date | null) => {
    console.log("🚀 Selected Date:", selectedDate);

    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setDate(selectedDate);
      onChange(selectedDate);
    } else {
      setDate(null);
      onChange(null);
    }
  };

  return (
    <div key={resetKey}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className="truncate">
              {date instanceof Date && !isNaN(date.getTime())
                ? format(new Date(date), "PPP")
                : "Pick a date"}
            </span>
            <CalendarIcon
              size={16}
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <Calendar
            mode="single"
            selected={date instanceof Date && !isNaN(date.getTime()) ? date : undefined}
            onSelect={handleDateChange}
            required
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
