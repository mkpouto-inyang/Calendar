// 📁 src/components/MonthDropDown.jsx
import React from "react";

export default function MonthDropDown({ selectedDate, onChange }) {
  const currentYear = selectedDate?.getFullYear() ?? new Date().getFullYear();
  const currentMonth = selectedDate?.getMonth() ?? new Date().getMonth();

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i);
    return {
      label: date.toLocaleString("default", { month: "long" }),
      value: `${currentYear}-${(i + 1).toString().padStart(2, "0")}-01`,
    };
  });

  const handleChange = (e) => {
    const newDate = new Date(e.target.value);
    onChange(newDate);
  };

  return (
    <select onChange={handleChange} value={selectedDate.toISOString().slice(0, 10)}>
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  );
}