"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Layout from "@/components/layout/Layout"
import { DeleteModal } from "@/components/ui/DeleteModal"
import api from "@/services/api"
import type { Event } from "@/types/event"
import { showError, showSuccess } from "@/services/toastService"
import { EventModal } from "@/components/event/EventModal"
import { MonthCalendar, useMonthNav } from "@/components/event/MonthCalendar"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; eventId: number | null }>({
    isOpen: false,
    eventId: null,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [createDate, setCreateDate] = useState<Date | null>(null)

  const { monthDate, onPrevMonth, onNextMonth, onToday } = useMonthNav()

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await api.get("/events")
      console.log("Fetched events:", res.data.events)
      setEvents(res.data.events ?? [])
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to fetch events.")
      console.error("Fetch events error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Handlers
  const onSelectDay = (day: Date) => {
    setSelectedEvent(null)
    setCreateDate(day)
    setModalOpen(true)
  }

  const onSelectEvent = (ev: Event) => {
    setSelectedEvent(ev)
    setCreateDate(null)
    setModalOpen(true)
  }

  const onNewEvent = () => {
    setSelectedEvent(null)
    setCreateDate(new Date())
    setModalOpen(true)
  }

  const handleDelete = (id: number) => setDeleteModal({ isOpen: true, eventId: id })

  const handleConfirmDelete = async () => {
    if (!deleteModal.eventId) return
    try {
      await api.delete(`/events/${deleteModal.eventId}`)
      showSuccess("Event deleted.")
      await fetchEvents()
    } catch (err: any) {
      showError("Failed to delete event.")
      console.error("Deletion error:", err)
    } finally {
      setDeleteModal({ isOpen: false, eventId: null })
    }
  }

  const handleCancelDelete = () => setDeleteModal({ isOpen: false, eventId: null })

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Calendar</h1>
                <p className="mt-1 text-sm text-gray-600">Manage your events and schedule</p>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading events…</p>
                </div>
              ) : (
                <MonthCalendar
                  monthDate={monthDate}
                  onPrevMonth={onPrevMonth}
                  onNextMonth={onNextMonth}
                  onToday={onToday}
                  events={events}
                  onSelectDay={onSelectDay}
                  onSelectEvent={onSelectEvent}
                />
              )}

              <div className="rounded-xl border bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
                  <h2 className="text-lg font-semibold text-gray-900">All Events</h2>
                  <p className="mt-1 text-sm text-gray-500">{events.length} total events</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {events.length === 0 ? (
                    <div className="px-4 py-8 text-center sm:px-6">
                      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No events yet.</p>
                      <p className="mt-1 text-sm text-gray-400">Create your first event to get started.</p>
                    </div>
                  ) : (
                    events.map((ev) => (
                      <div key={ev.id} className="px-4 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{ev.title}</h3>
                            <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                              <p className="text-sm text-gray-500">
                                {ev.start_date_formatted} → {ev.end_date_formatted}
                              </p>
                              {ev.priority && (
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    ev.priority === "High"
                                      ? "bg-red-100 text-red-700"
                                      : ev.priority === "Medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {ev.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectEvent(ev)}
                              className="flex items-center gap-1.5 px-3 py-1.5"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(ev.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit modal */}
        <EventModal
          key={selectedEvent?.id ?? "new"} // force re-render 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          initialDate={createDate}
          event={selectedEvent}
          onSaved={fetchEvents}
        />

        {/* Delete modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          loading={false}
          title="Delete this event?"
          description="This action cannot be undone."
        />
      </Layout>
    </ProtectedRoute>
  )
}
