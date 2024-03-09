import React, { useState, Suspense } from 'react';
import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import * as dayjs from 'dayjs';
import LoadingComponent from './LoadingComponent';
import ErrorComponent from './ErrorComponent';

const SignIn = React.lazy(() => import('./SignIn'));
const TaskForm = React.lazy(() => import('./TaskForm'));
const Tasks = React.lazy(() => import('./Tasks'));




function App() {
  const [tasks, setTasks] = useState([]);
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs().add(1, 'hour'));
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading: isSessionLoading } = useSessionContext();

  if (isLoading) {
    return <LoadingComponent message="Please wait..." />;
  }

  async function googleSignIn() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { scopes: 'https://www.googleapis.com/auth/calendar' },
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
      setError("Error logging in with Google");
    }
    setIsLoading(false);
  }


  async function signOut() {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setError("Error signing out");
    }
    setIsLoading(false);
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

  if (isSessionLoading || isLoading) {
    return <LoadingComponent message="Loading, please wait..." />;
  }


  return (
    <div className="App">
      <div className="container">
        {error && <ErrorComponent errorMessage={error} />}
        <Suspense fallback={<LoadingComponent message="Loading, please wait..." />}>
          {!session ? (
            <SignIn onSignIn={googleSignIn} />
          ) : (
            <>
              <h2>Welcome, {session.user.email}</h2>
              <TaskForm
                start={start}
                end={end}
                setStart={setStart}
                setEnd={setEnd}
                eventName={eventName}
                setEventName={setEventName}
                eventDescription={eventDescription}
                setEventDescription={setEventDescription}
                priority={priority}
                setPriority={setPriority}
                onAddTask={addTask}
              />
              <Tasks tasks={tasks} deleteTask={deleteTask} completeTask={completeTask} />
              <button onClick={signOut} className="button">Sign Out</button>
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
export default App;