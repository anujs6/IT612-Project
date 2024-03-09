import React from "react";
import {addTask, signOut} from "./App.js";
import './App.css';

export default function Button ({onClick, name}) {
  return (
    <button onClick={onClick} className="button">{name}</button>
  );
}