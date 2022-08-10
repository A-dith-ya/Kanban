import React from 'react'
import { Routes, Route } from "react-router-dom";
import Register from './routes/Register';
import Login from './routes/Login';
import Todo from './routes/Todo';
import Settings from './routes/Settings';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="todo" element={<Todo />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </>
  );
}

