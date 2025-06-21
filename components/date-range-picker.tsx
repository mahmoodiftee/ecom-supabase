"use client"

import * as React from "react"
import { addDays, format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange?: DateRange
  onDateChange?: (range: DateRange | undefined) => void
  defaultRange?: {
    days?: number // Defaults to last 30 days if not specified
    from?: Date
    to?: Date
  }
}

export function CalendarDateRangePicker({
  className,
  dateRange,
  onDateChange,
  defaultRange = { days: 30 },
}: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    // Use controlled prop if provided
    if (dateRange) return dateRange

    // Otherwise use default range
    const to = defaultRange.to || new Date()
    const from = defaultRange.from || subDays(to, defaultRange.days || 30)
    return { from, to }
  })

  // Handle both controlled and uncontrolled state
  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range)
    if (onDateChange) {
      onDateChange(range)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="hidden sm:inline">
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </span>
                  <span className="sm:hidden">
                    {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                  </span>
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={1}
            className="sm:hidden"
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="hidden sm:block"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}