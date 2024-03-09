import React from "react";
import * as dayjs from 'dayjs';
import './App.css';

export default function Tasks({tasks}) {
    return tasks.map(task => (
      <div key={task.id} className="task">
        <h3>{task.name}</h3>
        <p>Description: {task.description}</p>
        <p>Start: {dayjs(task.start).format('YYYY-MM-DD HH:mm')}</p>
        <p>End: {dayjs(task.end).format('YYYY-MM-DD HH:mm')}</p>
        <p>Priority: {task.priority}</p>
        <p>Status: {task.status}</p>
        <button onClick={() => deleteTask(task.id)} className="button">Delete Task</button>
        <button onClick={() => completeTask(task.id)} className="button">Mark as Completed</button>
      </div>
    ));
  }
