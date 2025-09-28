import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ClientData {
  customer_personal: number;
  customer_company: number;
  customer_bank: number;
}

interface ClientDistributionChartProps {
  data: ClientData | null;
  loading: boolean;
}

export function ClientDistributionChart({ data, loading }: ClientDistributionChartProps) {
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
    </div>;
  }

  const chartData = {
    labels: ["Personal", "Company", "Bank"],
    datasets: [
      {
        data: [
          data?.customer_personal ?? 0,
          data?.customer_company ?? 0,
          data?.customer_bank ?? 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(249, 115, 22, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(249, 115, 22)",
        ],
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
      <Pie data={chartData} options={options} />
    </div>
  );
}