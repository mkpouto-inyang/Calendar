import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "./Modal";
import DayViewHeader from "./DayviewHeader";
import "../Styles/calendar.css"

export default function MyCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [clickedDate, setClickedDate] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const calendarRef = useRef(null);

  const FAKE_EVENTS = [
    {
      id: "1",
      title: "Team Sync",
      start: new Date("2025-04-07T10:30:00"),
      end: new Date("2025-04-07T11:30:00"),
    },
    {
      id: "2",
      title: "Design Review",
      start: new Date("2025-04-08T13:00:00"),
      end: new Date("2025-04-08T14:00:00"),
    },
  ];

  useEffect(() => {
    const savedEvents = localStorage.getItem("myEvents");
    const parsedSavedEvents = savedEvents ? JSON.parse(savedEvents) : [];
  
    // Combine fake events with saved ones
    const combinedEvents = [...FAKE_EVENTS, ...parsedSavedEvents];
  
    setCurrentEvents(combinedEvents);
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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    calendarRef.current.getApi().gotoDate(newDate);
  };

  return (
    <div className="calendar-container">
      <div className="fc-wrapper">
        {currentView === "timeGridDay" ? (
          <>
            <DayViewHeader
              selectedDate={selectedDate}
              onPrev={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                handleDateChange(prev);
              }}
              onNext={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                handleDateChange(next);
              }}
              onDateChange={handleDateChange}
            />
            <FullCalendar
              ref={calendarRef}
              selectable
              height="85vh"
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={{ left: "", center: "", right: "" }}
              events={currentEvents}
              allDaySlot={false}
              dateClick={handleDateClick}
              datesSet={(arg) => {
                setCurrentView(arg.view.type);
              }}
            />
          </>
        ) : (
          <FullCalendar
            ref={calendarRef}
            selectable
            height="85vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={currentEvents}
            dateClick={handleDateClick}
            datesSet={(arg) => {
              setCurrentView(arg.view.type);
            }}
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
