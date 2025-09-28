import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GraphicWorkData {
  template_deed: string;
  count: number;
}

interface GraphicWorkChartProps {
  data: GraphicWorkData[] | null;
  loading: boolean;
}

export function GraphicWorkChart({ data, loading }: GraphicWorkChartProps) {
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
    </div>;
  }

  const chartData = {
    labels: data?.map(item => item.template_deed) ?? [],
    datasets: [
      {
        label: "Number of Works",
        data: data?.map(item => item.count) ?? [],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}