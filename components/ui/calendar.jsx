"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  showOutsideDays = true,
  numberOfMonths = 1,
  ...props
}) {
  // Map react-day-picker props to react-datepicker
  const handleChange = (date) => {
    if (!onSelect) return;
    
    if (mode === "range") {
      // Handle range selection
      if (!selected?.from || (selected.from && selected.to)) {
        // Start a new range selection
        onSelect({ from: date, to: undefined });
      } else {
        // Complete the range selection
        const range = { ...selected };
        
        // If the new date is before the start date, swap them
        if (date < selected.from) {
          range.to = selected.from;
          range.from = date;
        } else {
          range.to = date;
        }
        
        onSelect(range);
      }
    } else {
      // Single date selection
      onSelect(date);
    }
  };

  return (
    <div className={cn("p-3", className)}>
      <DatePicker
        selected={mode === "range" ? selected?.from : selected}
        onChange={handleChange}
        startDate={mode === "range" ? selected?.from : null}
        endDate={mode === "range" ? selected?.to : null}
        selectsRange={mode === "range"}
        inline
        monthsShown={numberOfMonths}
        calendarClassName="w-full"
        dayClassName={() => "h-9 w-9 p-0 font-normal"}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-center pt-1 relative items-center">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
