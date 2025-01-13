import React, { useEffect, useState } from "react";
import { Card, Title, DonutChart, BarChart } from "@tremor/react";
import { getTransactions } from "../services/api";
import TransactionInput from "./TransactionInput";
import TransactionTable from "./TransactionTable";

interface Transaction {
  id: number;
  month: string;
  category?: string;
  income: number;
  expense: number;
}

// Kleines Hilfstype für die Charts
interface CategoryData {
  name: string;
  value: number;
}

function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Laden beim Start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      fetchTransactions(storedToken);
    }
  }, []);

  async function fetchTransactions(token: string) {
    try {
      const data = await getTransactions(token);
      setTransactions(data);
    } catch (err) {
      console.error("Fehler beim Laden der Transaktionen:", err);
    }
  }

  // Callback aus der TransactionInput-Komponente
  function handleTransactionCreated() {
    if (token) {
      fetchTransactions(token);
    }
  }

  // 1) Pie Chart / Donut: Ausgaben pro Kategorie
  //    Wir filtern z.B. nur expense>0
  const expenseByCategory: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.expense > 0) {
      const cat = t.category || "Other";
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.expense;
    }
  });
  // In Format { name: string, value: number }
  const categoryData: CategoryData[] = Object.entries(expenseByCategory).map(
    ([cat, val]) => ({ name: cat, value: val })
  );

  // 2) BarChart: Summen pro Monat (Income vs. Expense)
  //    Falls du in `transactions` verschiedene Monate hast:
  const monthlyTotals: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    if (!monthlyTotals[t.month]) {
      monthlyTotals[t.month] = { income: 0, expense: 0 };
    }
    monthlyTotals[t.month].income += t.income;
    monthlyTotals[t.month].expense += t.expense;
  });
  const timelineData = Object.entries(monthlyTotals).map(([m, vals]) => ({
    month: m,
    income: vals.income,
    expense: vals.expense,
  }));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Eingabemaske (nur sinnvoll, wenn token vorhanden) */}
      {token ? (
        <TransactionInput
          token={token}
          onTransactionCreated={handleTransactionCreated}
        />
      ) : (
        <p>Bitte einloggen, um neue Transaktionen anzulegen.</p>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <Title>Ausgaben nach Kategorie</Title>
          <DonutChart
            className="mt-6"
            data={categoryData}
            category="value"
            index="name"
            variant="donut"
            colors={["cyan", "blue", "orange", "green", "purple", "red"]}
          />
        </Card>

        <Card>
          <Title>Monatliche Summen (Income vs. Expense)</Title>
          <BarChart
            className="mt-6"
            data={timelineData}
            index="month"
            categories={["income", "expense"]}
            colors={["emerald", "red"]}
            valueFormatter={(number) => `€ ${number}`}
            yAxisWidth={40}
          />
        </Card>
      </div>

      {/* Tabelle aller Transaktionen */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default Dashboard;
