// 📁 src/components/MyCalendar.jsx
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "./Modal";
import CalendarHeader from "./CalendarHeader";
import CalendarTitle from "./Title";
import DayViewHeader from "./DayviewHeader";

export default function MyCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [clickedDate, setClickedDate] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const calendarRef = useRef(null);

  const currentMonth = selectedDate.getMonth();
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const yearAdjustment = currentMonth + i >= 12 ? 1 : 0;
    const date = new Date(
      selectedDate.getFullYear() + yearAdjustment,
      monthIndex
    );
    return {
      label: date.toLocaleString("default", { month: "long" }),
      value: `${date.getFullYear()}-${(monthIndex + 1)
        .toString()
        .padStart(2, "0")}-01`,
    };
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("myEvents");
    if (savedEvents) {
      setCurrentEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("myEvents", JSON.stringify(currentEvents));
    console.log(`This is events: ${currentEvents}`);
  }, [currentEvents]);

  function handleDateClick(info) {
    console.log(info);
    setClickedDate(info.dateStr);
    setModalOpen(true);
  }

  function handleAddEvent(title) {
    if (title.trim() === "") return;

    const newEvent = {
      id: Date.now().toString(),
      title,
      start: new Date(`${clickedDate}T00:00:00`),
      end: new Date(`${clickedDate}T23:59:59`),
    };

    setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
    setModalOpen(false);
    setNewEventTitle("");
  }

  const handleMonthChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(new Date(newDate));
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div
        className="fc-wrapper"
      >
        {currentView === "timeGridDay" ? (
          <>
            <DayViewHeader
              selectedDate={selectedDate}
              onPrev={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                setSelectedDate(prev);
                calendarRef.current.getApi().gotoDate(prev);
              }}
              onNext={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                setSelectedDate(next);
                calendarRef.current.getApi().gotoDate(next);
              }}
              onDateChange={(date) => {
                setSelectedDate(date);
                calendarRef.current.getApi().gotoDate(date);
              }}
            />
            <FullCalendar
              ref={calendarRef}
              selectable
              height={"85vh"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={{ left: "", center: "", right: "" }}
              events={currentEvents}
              dateClick={handleDateClick}
              datesSet={(arg) => setCurrentView(arg.view.type)}
            />
          </>
        ) : (
          <FullCalendar
            ref={calendarRef}
            selectable
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={currentEvents}
            dateClick={handleDateClick}
            datesSet={(arg) => setCurrentView(arg.view.type)}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddEvent={handleAddEvent}
        date={clickedDate}
      />
    </div>
  );
}
