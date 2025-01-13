// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = await loginUser(username, password);
      localStorage.setItem("token", token);
      // Weiter zum Overview oder Transactions
      navigate("/overview");
    } catch (error) {
      console.error("Login fehlgeschlagen!", error);
      // Evtl. Error Message in den State setzen.
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs">
        <input
          type="text"
          placeholder="Username"
          className="border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
