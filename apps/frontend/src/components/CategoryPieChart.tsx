import React from "react";
import { DonutChart, Card, Title } from "@tremor/react";

interface CategoryData {
  name: string;
  value: number;
}

interface Props {
  data: CategoryData[];
  title?: string;
}

const CategoryPieChart: React.FC<Props> = ({ data, title }) => {
  return (
    <Card>
      <Title>{title || "Expenses by Category"}</Title>
      <DonutChart
        className="mt-6"
        data={data}
        category="value"
        index="name"
        variant="donut"
        colors={["cyan", "blue", "orange", "green", "purple", "red"]}
      />
    </Card>
  );
};

export default CategoryPieChart;
