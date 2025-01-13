import React from "react";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onMonthChange,
}) => {
  const months = ["January", "February", "March", "April", "May", "June"];

  return (
    <div className="mb-4">
      <label htmlFor="month" className="mr-2 font-semibold">
        Select Month:
      </label>
      <select
        name="month"
        id="month"
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="border p-1 rounded"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
