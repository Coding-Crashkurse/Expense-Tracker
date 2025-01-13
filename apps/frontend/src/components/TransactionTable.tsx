import React from "react";

interface Transaction {
  id: number;
  month: string;
  category?: string;
  income: number;
  expense: number;
}

interface Props {
  transactions: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  return (
    <table className="min-w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Month</th>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Income</th>
          <th className="p-2 border">Expense</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td className="p-2 border">{t.month}</td>
            <td className="p-2 border">{t.category || "-"}</td>
            <td className="p-2 border">{t.income}</td>
            <td className="p-2 border">{t.expense}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
