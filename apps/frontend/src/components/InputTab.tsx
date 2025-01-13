import React, { useEffect, useState } from "react";
import { getTransactions, createTransaction } from "../services/api";

// Zeile im Input-Tab (lokal, unsaved)
interface TransactionRow {
  id?: number;
  month: string;
  type: "" | "income" | "expense";
  category: string;
  amount: number;
}

// Listen für vordefinierte Kategorien
const expenseCategories = ["Food", "Rent", "Shopping", "Transport"];
const incomeCategories = ["Salary", "Bonus", "Investments", "Freelance"];
const months = ["January", "February", "March", "April", "May", "June"];

function InputTab() {
  const [token] = useState<string | null>(localStorage.getItem("token"));
  // Rows enthält nur bereits existierende Transaktionen plus neu hinzugefügte (unsaved)
  const [rows, setRows] = useState<TransactionRow[]>([]);

  // Beim Mount: vorhandene (bereits gespeicherte) Transaktionen laden
  useEffect(() => {
    if (token) {
      getTransactions(token).then((backendData) => {
        // Konvertiere Backend-Daten => TransactionRow
        const convertedRows: TransactionRow[] = backendData.map((t: any) => {
          let typeVal: "" | "income" | "expense";
          if (Number(t.income) > 0) {
            typeVal = "income";
          } else if (Number(t.expense) > 0) {
            typeVal = "expense";
          } else {
            typeVal = "";
          }

          return {
            id: t.id,
            month: String(t.month),
            type: typeVal,
            category: String(t.category || ""),
            amount: Number(t.income) > 0 ? Number(t.income) : Number(t.expense),
          };
        });
        setRows(convertedRows);
      });
    }
  }, [token]);

  // Neue Zeile (unsaved)
  function addNewRow() {
    setRows((prev) => [
      ...prev,
      { month: months[0], type: "", category: "", amount: 0 },
    ]);
  }

  // Handler für Änderungen in einer Tabellenzelle
  function handleCellChange(
    index: number,
    field: keyof TransactionRow,
    value: string
  ) {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated = { ...row };
        if (field === "amount") {
          updated.amount = parseFloat(value) || 0;
        } else if (field === "type") {
          updated.type = value as "income" | "expense" | "";
          // Reset category, wenn Type wechselt
          updated.category = "";
        } else {
          (updated as any)[field] = value;
        }
        return updated;
      })
    );
  }

  // Klick auf "Save" => POST an Backend => neu laden
  async function saveRow(index: number) {
    if (!token) {
      alert("Bitte einloggen!");
      return;
    }
    const row = rows[index];

    // Minimale Validierung
    if (row.type === "") {
      alert("Bitte income oder expense wählen!");
      return;
    }
    if (!row.category) {
      alert("Bitte eine Kategorie wählen!");
      return;
    }

    try {
      await createTransaction(
        token,
        row.month,
        row.category,
        row.type,
        row.amount
      );
      alert("Transaktion gespeichert!");

      // Nach dem Speichern: neu laden
      const backendData = await getTransactions(token);
      const convertedRows: TransactionRow[] = backendData.map((t: any) => {
        let typeVal: "" | "income" | "expense";
        if (Number(t.income) > 0) {
          typeVal = "income";
        } else if (Number(t.expense) > 0) {
          typeVal = "expense";
        } else {
          typeVal = "";
        }

        return {
          id: t.id,
          month: String(t.month),
          type: typeVal,
          category: String(t.category || ""),
          amount: Number(t.income) > 0 ? Number(t.income) : Number(t.expense),
        };
      });
      setRows(convertedRows);
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      alert("Fehler beim Speichern!");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-bold">Input / Bearbeitung</h1>

      {!token ? (
        <p>Bitte einloggen, um Transaktionen anzulegen.</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-2 border-r">Month</th>
                  <th className="p-2 border-r">Type</th>
                  <th className="p-2 border-r">Category</th>
                  <th className="p-2 border-r">Amount</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id ?? `new-${idx}`} className="border-b">
                    {/* MONTH */}
                    <td className="p-2 border-r">
                      <select
                        value={row.month}
                        onChange={(e) =>
                          handleCellChange(idx, "month", e.target.value)
                        }
                        className="border p-1"
                      >
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* TYPE */}
                    <td className="p-2 border-r">
                      <select
                        value={row.type}
                        onChange={(e) =>
                          handleCellChange(idx, "type", e.target.value)
                        }
                        className="border p-1"
                      >
                        <option value="">(Bitte wählen)</option>
                        <option value="income">Einnahme</option>
                        <option value="expense">Ausgabe</option>
                      </select>
                    </td>

                    {/* CATEGORY */}
                    <td className="p-2 border-r">
                      <select
                        value={row.category}
                        onChange={(e) =>
                          handleCellChange(idx, "category", e.target.value)
                        }
                        disabled={row.type === ""}
                        className="border p-1"
                      >
                        <option value="">(Bitte wählen)</option>
                        {row.type === "income" &&
                          incomeCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        {row.type === "expense" &&
                          expenseCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-2 border-r">
                      <input
                        type="number"
                        value={row.amount}
                        onChange={(e) =>
                          handleCellChange(idx, "amount", e.target.value)
                        }
                        className="border p-1 w-24"
                      />
                    </td>

                    {/* ACTION */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => saveRow(idx)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addNewRow}
            className="bg-green-500 text-white px-3 py-1 mt-4 rounded"
          >
            + Add Row
          </button>
        </>
      )}
    </div>
  );
}

export default InputTab;
