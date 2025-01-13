import React, { useEffect, useState } from "react";
import { Card, Title, DonutChart, BarChart } from "@tremor/react";
import { getTransactions } from "../services/api";
import TransactionTable from "./TransactionTable";

function OutputTab() {
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filterMonth, setFilterMonth] = useState("All");

  // Beim Mount / token-Änderung => laden
  useEffect(() => {
    if (token) {
      getTransactions(token)
        .then((data) => setTransactions(data))
        .catch((err) => console.error("Fehler:", err));
    }
  }, [token]);

  // 1) PieChart: Nur "Ausgaben" (expense>0). Wir filtern optional nach Monat
  const filteredExpenses = transactions.filter((t) => {
    if (filterMonth === "All") return t.expense > 0;
    return t.expense > 0 && t.month === filterMonth;
  });
  const expenseByCategory: Record<string, number> = {};
  filteredExpenses.forEach((t) => {
    const cat = t.category || "Sonstiges";
    expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.expense;
  });
  const donutData = Object.entries(expenseByCategory).map(([cat, val]) => ({
    name: cat,
    value: val,
  }));

  // 2) BarChart: Income vs. Expense pro Monat (gesamte Daten, ohne Filter)
  //    oder du könntest hier denselben Filter anwenden, wenn du willst.
  const monthlyTotals: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    if (!monthlyTotals[t.month]) {
      monthlyTotals[t.month] = { income: 0, expense: 0 };
    }
    monthlyTotals[t.month].income += t.income;
    monthlyTotals[t.month].expense += t.expense;
  });
  const barData = Object.entries(monthlyTotals).map(([month, sums]) => ({
    month,
    income: sums.income,
    expense: sums.expense,
  }));

  // 3) Alle vorhandenen Monate (zur Filter-Auswahl)
  const allMonths = Array.from(new Set(transactions.map((t) => t.month)));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard / Output</h1>

      {!token ? (
        <p>Bitte einloggen, um Daten zu sehen.</p>
      ) : (
        <>
          {/* Monat-Filter: "All" oder einer der vorhandenen Monate */}
          <div className="mb-4">
            <label className="mr-2">Filter (Ausgaben) nach Monat:</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="All">All</option>
              {allMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DonutChart: Ausgaben (optional gefiltert nach Monat) */}
            <Card>
              <Title>Ausgaben nach Kategorie</Title>
              <DonutChart
                className="mt-4"
                data={donutData}
                category="value"
                index="name"
                variant="donut"
                colors={["cyan", "blue", "orange", "emerald", "red", "purple"]}
              />
            </Card>

            {/* BarChart: Income vs. Expense pro Monat (kein Filter, oder optional) */}
            <Card>
              <Title>Monatliche Summen (Income vs. Expense)</Title>
              <BarChart
                className="mt-4"
                data={barData}
                index="month"
                categories={["income", "expense"]}
                colors={["emerald", "red"]}
                valueFormatter={(val: number) => `€ ${val.toLocaleString()}`}
                yAxisWidth={40}
              />
            </Card>
          </div>

          {/* Tabelle aller Transaktionen (ungesfiltered oder gefiltert) */}
          <TransactionTable transactions={transactions} />
        </>
      )}
    </div>
  );
}

export default OutputTab;
