// CalendarHeader.js
import React from "react";

export default function CalendarHeader({ selectedDate, onMonthChange, onToday, months }) {
  return (
    <div className="calendar-header">
    <div className="select-wrapper">
  <select onChange={onMonthChange} value={selectedDate.toISOString().slice(0, 10)}>
    {months.map((month) => (
        <option key={month.value} value={month.value}>
        {month.label}
      </option>
    ))}
  </select>
</div>
  </div>
  
  );
}
