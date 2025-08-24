"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Event, PriorityOption } from "@/types/event"
import api from "@/services/api"
import { showError, showSuccess } from "@/services/toastService"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Mode = "create" | "edit"

export function EventModal({
  isOpen,
  onClose,
  initialDate,
  event,
  onSaved,
}: {
  isOpen: boolean
  onClose: () => void
  initialDate?: Date | null
  event?: Event | null
  onSaved: () => void
}) {
  const mode: Mode = event ? "edit" : "create"

  const defaultDateStr = useMemo(() => {
    const d = initialDate ?? new Date()
    return d.toISOString().slice(0, 10)
  }, [initialDate])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(defaultDateStr)
  const [endDate, setEndDate] = useState(defaultDateStr)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [priority, setPriority] = useState("")
  const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([])
  const [saving, setSaving] = useState(false)

  const prevIsOpen = useRef(false)

  // fetch priority options once
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await api.get("/events/priority-options")
        setPriorityOptions(response.data.events || [])
      } catch {
        showError("Failed to fetch priority options.")
      }
    }
    fetchPriorities()
  }, [])

  // reset form only when modal just opens
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      console.log("RESET FORM triggered", {
        event,
        defaultDateStr,
        priorityOptions,
      })

      if (event) {
        setTitle(event.title ?? "")
        setDescription(event.description ?? "")
        setStartDate(event.start_date)
        setEndDate(event.end_date)
        setPriority(event.priority ?? "")
        setStartTime((event.start_time ?? "09:00").slice(0, 5))
        setEndTime((event.end_time ?? "10:00").slice(0, 5))
      } else {
        setTitle("")
        setDescription("")
        setStartDate(defaultDateStr)
        setEndDate(defaultDateStr)
        setStartTime("09:00")
        setEndTime("10:00")
        setPriority("")
      }
    }
    prevIsOpen.current = isOpen
  }, [isOpen, event, defaultDateStr])

  // if creating, set default priority after options load
  useEffect(() => {
    if (!event && isOpen && !priority && priorityOptions.length > 0) {
      console.log("Setting default priority:", priorityOptions[0].value)
      setPriority(priorityOptions[0].value)
    }
  }, [priorityOptions, event, isOpen, priority])

  const validate = () => {
    if (!title.trim()) return "Title is required."
    if (endDate < startDate) return "End date must be on/after start date."
    if (startDate === endDate && endTime <= startTime) {
      return "End time must be after start time."
    }
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) {
      showError(err)
      return
    }

    setSaving(true)
    try {
      if (mode === "create") {
        await api.post("/events", {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          priority,
        })
        showSuccess("Event created.")
      } else if (event) {
        await api.put(`/events/${event.id}`, {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          start_time: startTime,
          end_time: endTime,
          priority,
        })
        showSuccess("Event updated.")
      }
      onSaved()
      onClose()
    } catch (e: any) {
      showError(e?.response?.data?.message || "Failed to save event.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[44vh] sm:max-w-lg max-h-[70vh] sm:max-h-[95vh] flex flex-col rounded-xl">
        <DialogHeader className="pb-4 space-y-2">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Create Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === "create" ? "Fill in the details to create a new event." : "Update the details of this event."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto pr-1">
          <LabelInputContainer>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              placeholder="Team Sync, Client Demo…"
              autoComplete="off"
              className="mt-1"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes or agenda…"
              rows={3}
              autoComplete="off"
              className="mt-1 resize-none"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority" className="mt-1">
                <SelectValue placeholder="Choose priority" />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          option.value === "High"
                            ? "bg-red-500"
                            : option.value === "Medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      {option.value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1"
                />
              </LabelInputContainer>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1"
                />
              </LabelInputContainer>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={saving} className="w-full sm:w-auto bg-transparent cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-800 cursor-pointer">
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving…
              </div>
            ) : mode === "create" ? (
              "Create Event"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("flex w-full flex-col space-y-1", className)}>{children}</div>
}
