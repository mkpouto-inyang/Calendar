// 📁 src/components/DayViewHeader.jsx
import React from "react";
import "./DayViewHeader.css";

export default function DayViewHeader({ daysOfWeek, selectedDate, onSelectDay, onPrev, onNext, monthLabel }) {
  return (
    <div className="day-header-container">
      <button className="arrow-btn" onClick={onPrev}>‹</button>
      <div className="day-buttons">
        {daysOfWeek.map((day, index) => {
          const isSelected = day.date === selectedDate.toDateString();
          return (
            <button
              key={index}
              className={`day-btn ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectDay(new Date(day.date))}
            >
              <span>{day.label}</span>
              <span>{day.day}</span>
            </button>
          );
        })}
      </div>
      <button className="arrow-btn" onClick={onNext}>›</button>

      <div className="month-label">{monthLabel}</div>
    </div>
  );
}