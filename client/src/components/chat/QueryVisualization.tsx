import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface QueryVisualizationProps {
  data: {
    labels: string[];
    values: number[];
  };
  chartType: string;
}

export default function QueryVisualization({ data, chartType }: QueryVisualizationProps) {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 10, bottom: 20 },
    };

    const commonAxisProps = {
      tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
      tickLine: { stroke: "hsl(var(--muted-foreground))" },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground)/0.2)"
            />
            <XAxis
              dataKey="name"
              {...commonAxisProps}
              height={40}
              tickMargin={10}
            />
            <YAxis
              {...commonAxisProps}
              width={40}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
                r: 6,
              }}
            />
          </LineChart>
        );
      case "bar":
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground)/0.2)"
            />
            <XAxis
              dataKey="name"
              {...commonAxisProps}
              height={40}
              tickMargin={10}
            />
            <YAxis
              {...commonAxisProps}
              width={40}
              tickMargin={10}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.2)" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}