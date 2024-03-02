import React, { useState } from 'react';
import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import * as dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import Tasks from "./Tasks";

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
    });
    if (error) {
      alert("Error logging in with Google");
      console.error(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function addTask() {
    const newTask = {
      id: tasks.length + 1,
      name: eventName,
      description: eventDescription,
      start: start.toISOString(),
      end: end.toISOString(),
      priority,
      status: "Pending"
    };
    setTasks([...tasks, newTask]);
    // Reset form fields after adding a task
    setEventName("");
    setEventDescription("");
    setStart(dayjs());
    setEnd(dayjs().add(1, 'hour'));
  }

  return (
    <div className="App">
      <div className="container">
        {session ? (
          <>
            <h2>Welcome, {session.user.email}</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
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
            <button onClick={addTask} className="button">Add Task</button>
            <button onClick={signOut} className="button">Sign Out</button>
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
