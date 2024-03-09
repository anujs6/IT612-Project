// TaskForm.js
import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from './Button'; // Assuming you have a Button component

function TaskForm({ start, end, setStart, setEnd, eventName, setEventName, eventDescription, setEventDescription, priority, setPriority, onAddTask }) {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Start Date Time"
          value={start}
          onChange={(newValue) => setStart(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          label="End Date Time"
          value={end}
          onChange={(newValue) => setEnd(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Event Description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        className="input"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="input"
      >
        <option value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
      </select>
      <Button onClick={onAddTask} name="Add Task" />
    </div>
  );
}

export default TaskForm;
