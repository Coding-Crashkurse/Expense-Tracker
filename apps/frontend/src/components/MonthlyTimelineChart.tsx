import React from "react";
import { Card, Title, BarChart } from "@tremor/react";

interface TimelineData {
  day: string;
  expense: number;
  income: number;
}

interface Props {
  data: TimelineData[];
  title?: string;
}

const MonthlyTimelineChart: React.FC<Props> = ({ data, title }) => {
  return (
    <Card className="mt-4">
      <Title>{title || "Monthly Timeline"}</Title>
      <BarChart
        className="mt-6"
        data={data}
        index="day"
        categories={["expense", "income"]}
        colors={["red", "emerald"]}
        valueFormatter={(number: number) => `€ ${number.toFixed(2)}`}
        yAxisWidth={40}
      />
    </Card>
  );
};

export default MonthlyTimelineChart;
