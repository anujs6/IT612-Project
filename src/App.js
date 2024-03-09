import React, { useState } from 'react';
import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import * as dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import Tasks from './Tasks';
import Button from './Button';

function App() {
  const [tasks, setTasks] = useState([]);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1, 'hour'));
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [priority, setPriority] = useState("Normal");

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });

    if (error) {
      alert("Error logging in with Google");
      console.error(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function addTask() {
    const event = {
      'summary': eventName, 
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    const eventData = await response.json();

    const newTask = {
      id: tasks.length + 1,
      description: eventDescription,
      start: start.toISOString(),
      end: end.toISOString(),
      priority,
      status: "Pending",
      googleEventId: eventData.id 
    };

    setTasks([...tasks, newTask]);
    setEventName("");
    setEventDescription("");
    setStart(dayjs());
    setEnd(dayjs().add(1, 'hour'));
  }

  async function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    if (task.googleEventId) {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.googleEventId}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete event from Google Calendar');
        }
      }).catch(error => {
        console.error("Error deleting event from Google Calendar:", error);
      });
    }

    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    setTasks(newTasks);
  }

 async function completeTask(taskId) {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: "Completed" };
      }
      return task;
    }));
  }

  return (
    <div className="App">
      <div className="container">
        {session ? (
          <>
            <h2>Welcome, {session.user.email}</h2>
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
            <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="input" />
            <input type="text" placeholder="Event Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="input" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input">
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
            <Button onClick={addTask} name="Add Task" />
            <Button onClick={signOut} name="Sign Out" />
            <Tasks tasks={tasks} />
          </>
        ) : (
          <button onClick={googleSignIn} className="button">Sign in with Google</button>
        )}
      </div>
    </div>
  );
}
export default App;
