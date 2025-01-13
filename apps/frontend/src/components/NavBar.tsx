// src/components/NavBar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    // Token entfernen
    localStorage.removeItem("token");
    // Ab zur Login-Seite
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="space-x-4">
        {/* Geschützte Routen */}
        <Link to="/transactions">Transactions</Link>
        <Link to="/overview">Overview</Link>
        {/* Login-Link kannst du optional ausblenden, wenn token da ist */}
        {!token && <Link to="/login">Login</Link>}
      </div>

      {/* Logout-Button nur anzeigen, wenn man eingeloggt ist */}
      {token && (
        <button className="bg-red-500 px-3 py-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default NavBar;
