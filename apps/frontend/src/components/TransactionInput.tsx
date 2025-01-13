import React, { useState } from "react";
import { createTransaction } from "../services/api";

interface Props {
  token: string | null;
  onTransactionCreated: () => void;
  // Callback, damit das Dashboard weiß: "Neue Transaktion eingefügt, also Daten neu laden"
}

const TransactionInput: React.FC<Props> = ({ token, onTransactionCreated }) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [month, setMonth] = useState("January");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Bitte einloggen, um eine Transaktion anzulegen!");
      return;
    }

    try {
      await createTransaction(token, month, category, type, amount);
      // Nach dem POST: Felder zurücksetzen
      setCategory("");
      setAmount(0);
      // Dashboard sagen: "Daten neu laden"
      onTransactionCreated();
    } catch (error) {
      console.error("Fehler beim Anlegen der Transaktion:", error);
      alert("Transaktion konnte nicht angelegt werden.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded-md">
      <div>
        <label className="mr-2">Typ:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="border p-1 rounded"
        >
          <option value="income">Einnahme</option>
          <option value="expense">Ausgabe</option>
        </select>
      </div>

      <div>
        <label className="mr-2">Monat:</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          {/* etc. */}
        </select>
      </div>

      <div>
        <label className="mr-2">Kategorie:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-1 rounded"
          placeholder="z.B. Food, Rent, ..."
          required
        />
      </div>

      <div>
        <label className="mr-2">Betrag:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="border p-1 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Hinzufügen
      </button>
    </form>
  );
};

export default TransactionInput;
