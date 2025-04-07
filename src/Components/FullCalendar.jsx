import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; 
import Modal from "./Modal";
import CalendarHeader from "./CalendarHeader";
import { Calendar } from "@fullcalendar/core/index.js";
import CalendarTitle from "./Title";

export default function MyCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [clickedDate, setClickedDate] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calendarRef = useRef(null);

   // Populate months dropdown
   const currentMonth = selectedDate.getMonth(); // 0-based index

   const months = Array.from({ length: 12 }, (_, i) => {
     const monthIndex = (currentMonth + i) % 12;
     const yearAdjustment = currentMonth + i >= 12 ? 1 : 0;
     const date = new Date(selectedDate.getFullYear() + yearAdjustment, monthIndex);
     
     return {
       label: date.toLocaleString("default", { month: "long" }),
       value: `${date.getFullYear()}-${(monthIndex + 1).toString().padStart(2, "0")}-01`,
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
    console.log(`This is events: ${currentEvents}`)
  }, [currentEvents]);

  function handleDateClick(info) {
    console.log(info)
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
      {/* Calendar */}

      <div
        className="calendar-wrapper"
        style={{ flex: 1, position: "relative" }}
      >
        <CalendarTitle/>
        <CalendarHeader
          selectedDate={selectedDate}
          onMonthChange={handleMonthChange}
          onToday={() => {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.today();
          }}
          months={months}
        />

        <FullCalendar
          ref={calendarRef}
          selectable
          height={"85vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev next",
            center: "",
            right: "timeGridDay",
          }}
          initialView="dayGridMonth"
          events={currentEvents}
          dateClick={handleDateClick}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddEvent={handleAddEvent}
        date={clickedDate}
      />
    </div>
  );
}

//ToDO:
// Make the localStorage events data persist
// Fetch events from Google Calendar
// Figure out styling