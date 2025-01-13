// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import Transactions from "./components/InputTab"; // ehemals Input
import Overview from "./components/OutputTab"; // ehemals Output
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <Router>
      {/* Navbar erscheint immer (du könntest sie auch nur bei geschützten Routen anzeigen) */}
      <NavBar />

      <Routes>
        {/* Öffentlich: Login */}
        <Route path="/login" element={<Login />} />

        {/* Geschützte Routen */}
        <Route
          path="/transactions"
          element={
            <RequireAuth>
              <Transactions />
            </RequireAuth>
          }
        />
        <Route
          path="/overview"
          element={
            <RequireAuth>
              <Overview />
            </RequireAuth>
          }
        />

        {/* Default auf /overview */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Overview />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
