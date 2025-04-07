import './DayViewHeader.css'


export default function DayViewHeader({ selectedDate, onPrev, onNext }) {
    if (!selectedDate) return null; 
  
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        number: date.getDate(),
        fullDate: date.toDateString(),
        isToday: date.toDateString() === selectedDate.toDateString(),
      };
    });
  
    const monthLabel = selectedDate.toLocaleString("default", { month: "long" });
  
    return (
      <div className="dayview-header">
        <h2 className="header-title">Scheduled Meetings</h2>
        <div className="dayview-nav">
          <button className="nav-arrow" onClick={onPrev}>‹</button>
  
          <div className="dayview-days">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`dayview-day${day.isToday ? " selected" : ""}`}
              >
                <div className="day-label">{day.label}</div>
                <div className="day-number">{day.number}</div>
              </div>
            ))}
          </div>
  
          <button className="nav-arrow" onClick={onNext}>›</button>
          <div className="month-label">{monthLabel}</div>
        </div>
      </div>
    );
  }
  