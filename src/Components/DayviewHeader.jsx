import '../Styles/DayViewHeader.css';

export default function DayViewHeader({ selectedDate, onPrev, onNext, onDateChange }) {
  if (!selectedDate) return null;

  const currentMonth = selectedDate.getMonth();
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const yearAdjustment = currentMonth + i >= 12 ? 1 : 0;
    const date = new Date(selectedDate.getFullYear() + yearAdjustment, monthIndex);
    return {
      label: date.toLocaleString("default", { month: "long" }),
      value: `${date.getFullYear()}-${(monthIndex + 1).toString().padStart(2, "0")}-01`,
    };
  });

  const handleMonthChange = (e) => {
    const newDate = new Date(e.target.value);
    if (typeof onDateChange === "function") {
      onDateChange(newDate);
    }
  };

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
      isToday: date.toDateString() === selectedDate.toDateString(),
    };
  });

  return (
    <div className="dayview-header">
      <div className="dayview-top">
        <h2 className="header-title">Scheduled Meetings</h2>
        <div className="month-label">
          <select
            className="month-dropdown"
            onChange={handleMonthChange}
            value={selectedDate.toISOString().slice(0, 10)}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                  {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dayview-nav">
        <button className="nav-arrow" onClick={onPrev}>‹</button>

        <div className="dayview-days">
          {days.map((day, idx) => (
            <div key={idx} className={`dayview-day${day.isToday ? " selected" : ""}`}>
              <div className="day-label">{day.label}</div>
              <div className="day-number">{day.number}</div>
            </div>
          ))}
        </div>

        <button className="nav-arrow" onClick={onNext}>›</button>
      </div>
    </div>
  );
}
