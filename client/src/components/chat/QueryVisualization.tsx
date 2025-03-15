import ReactApexChart from "react-apexcharts";

interface QueryVisualizationProps {
  data: {
    labels: string[];
    values: number[];
  };
  chartType: string;
}

export default function QueryVisualization({ data, chartType }: QueryVisualizationProps) {
  const getChartType = (type: string): "line" | "bar" => {
    const normalizedType = type.toLowerCase();
    return normalizedType.includes("line") ? "line" : "bar";
  };

  const chartOptions = {
    chart: {
      type: getChartType(chartType),
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      foreColor: "hsl(var(--muted-foreground))",
      background: "transparent",
    },
    theme: {
      mode: "light",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: data.labels,
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        },
      },
      axisBorder: {
        color: "hsl(var(--border))",
      },
      axisTicks: {
        color: "hsl(var(--border))",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        },
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
      y: {
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    fill: {
      opacity: 1,
      colors: ["hsl(var(--primary))"],
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
  };

  const series = [
    {
      name: "Value",
      data: data.values,
    },
  ];

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <div className="h-[300px] w-full">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type={getChartType(chartType)}
          height="100%"
        />
      </div>
    </div>
  );
}