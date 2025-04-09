import React, { useState } from "react";
import '../Styles/modal.css'

const Modal = ({ isOpen, onClose, onAddEvent, date }) => {
  const [title, setTitle] = useState(""); 

  if (!isOpen || !date) return null;

  const handleSubmit = () => {
    if (title.trim() === "") return;
    onAddEvent(title);
    setTitle(""); 
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add New Event</h3>
        <p>Date: {date}</p>
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="modal-buttons">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSubmit}>Add Event</button>
         
        </div>
      </div>
    </div>
  );
};

export default Modal;
