"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

type CalendarEvent = { name: string; date: string; category?: string; description?: string };

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dateKey = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = useMemo(() => {
    const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    return Array.from({ length: total }, (_, index) => {
      const day = index - firstDay + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  }, [firstDay, daysInMonth]);
  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
      if (event.date) (acc[event.date.slice(0, 10)] ||= []).push(event);
      return acc;
    }, {});
  }, [events]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];
  const monthLabel = visibleMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return <div className="calendar-layout">
    <section className="calendar-panel" aria-label="Events calendar">
      <div className="calendar-toolbar"><div><span className="eyebrow">TRITONS DIARY</span><h3>{monthLabel}</h3></div><div className="calendar-controls"><button aria-label="Previous month" onClick={() => { setVisibleMonth(new Date(year, month - 1, 1)); setSelectedDate(null); }}><ChevronLeft size={18}/></button><button aria-label="Next month" onClick={() => { setVisibleMonth(new Date(year, month + 1, 1)); setSelectedDate(null); }}><ChevronRight size={18}/></button></div></div>
      <div className="calendar-grid">{weekdays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}{cells.map((day, index) => {
        const key = day ? dateKey(year, month, day) : "";
        const hasEvent = Boolean(eventsByDate[key]?.length);
        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
        return <button key={index} disabled={!day} className={`calendar-day${hasEvent ? " has-event" : ""}${selectedDate === key ? " selected" : ""}${isToday ? " today" : ""}`} onClick={() => setSelectedDate(key)}><span>{day || ""}</span>{hasEvent && <i/>}</button>;
      })}</div>
      <div className="calendar-legend"><span><i/> Club event or session</span><span>Choose a date to see details</span></div>
    </section>
    <aside className="calendar-agenda"><span className="eyebrow"><CalendarDays size={14}/> SELECTED DATE</span>{selectedDate ? <><h3>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h3>{selectedEvents.length ? selectedEvents.map((event, index) => <article className="agenda-event" key={index}><span>{event.category || "TRITONS EVENT"}</span><strong>{event.name}</strong><p>{event.description}</p></article>) : <p className="agenda-empty">Nothing listed for this date. Try another day.</p>}</> : <><h3>What's coming up?</h3><p className="agenda-empty">Select a highlighted date in the calendar to see event details.</p>{events.filter((event) => event.date >= dateKey(year, month, 1)).slice(0, 3).map((event, index) => <article className="agenda-event" key={index}><span>{event.date ? new Date(event.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "DATE TBC"}</span><strong>{event.name}</strong><p>{event.description}</p></article>)}</>}</aside>
  </div>;
}
