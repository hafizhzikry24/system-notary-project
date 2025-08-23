"use client"

import { useState } from "react"
import type { Event } from "@/types/event"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

function dateToYMD(d: Date) {
  return d.toISOString().slice(0, 10)
}

function eventOccursOnDay(ev: Event, day: Date) {
  const dayStart = new Date(day)
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date(day)
  dayEnd.setHours(23, 59, 59, 999)

  const eventStart = new Date(`${ev.start_date}T${ev.start_time}`)
  const eventEnd = new Date(`${ev.end_date}T${ev.end_time}`)

  return eventStart <= dayEnd && eventEnd >= dayStart
}

export function MonthCalendar({
  monthDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  events,
  onSelectDay,
  onSelectEvent,
}: {
  monthDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  events: Event[]
  onSelectDay: (day: Date) => void
  onSelectEvent: (ev: Event) => void
}) {
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50/50 border-b border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{format(monthDate, "MMMM yyyy")}</h2>
              <p className="text-sm text-gray-500">{events.length} events this month</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onToday} className="px-3 py-2 text-sm font-medium bg-transparent">
              Today
            </Button>
            <div className="flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevMonth}
                className="rounded-r-none border-r px-3 py-2 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextMonth}
                className="rounded-l-none px-3 py-2 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Week days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {weekLabels.map((w) => (
            <div key={w} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span className="hidden sm:inline">{w}</span>
              <span className="sm:hidden">{w.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day) => {
            const inMonth = isSameMonth(day, monthDate)
            const isNow = isToday(day)
            const dayEvents = events.filter((ev) => eventOccursOnDay(ev, day))

            return (
              <button
                type="button"
                key={day.toISOString()}
                onClick={() => onSelectDay(day)}
                className={[
                  "flex flex-col rounded-lg border p-1 sm:p-2 text-left transition-all duration-200 min-h-[50px] sm:min-h-[100px] sm:min-w-[155px] max-w-[50px]",
                  inMonth
                    ? "bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm"
                    : "bg-gray-50/50 hover:bg-gray-100",
                  isNow ? "ring-2 ring-blue-500 ring-offset-1" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={[
                      "text-xs sm:text-sm font-medium",
                      inMonth ? "text-gray-900" : "text-gray-400",
                      isNow ? "text-blue-600 font-semibold" : "",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                  </span>
                  {isNow && (
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                      Today
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-0.5 sm:space-y-1">
                  {dayEvents.slice(0, 2).map((ev: any) => {
                    const priorityColors: Record<string, string> = {
                      High: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
                      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
                      Low: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
                    }

                    return (
                      <div
                        key={`${ev.id}-${ev.start_date}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectEvent(ev)
                        }}
                        className={`cursor-pointer truncate rounded-md border px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium transition-colors ${
                          priorityColors[ev.priority] || "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                        title={`${ev.title} (${ev.start_time}–${ev.end_time})`}
                      >
                        <span className="block truncate">{ev.title}</span>
                      </div>
                    )
                  })}
                  {dayEvents.length > 2 && (
                    <div className="truncate rounded-md bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600 font-medium">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function useMonthNav() {
  const [monthDate, setMonthDate] = useState<Date>(new Date())
  return {
    monthDate,
    onPrevMonth: () => setMonthDate((d: any) => subMonths(d, 1)),
    onNextMonth: () => setMonthDate((d: any) => addMonths(d, 1)),
    onToday: () => setMonthDate(new Date()),
  }
}
