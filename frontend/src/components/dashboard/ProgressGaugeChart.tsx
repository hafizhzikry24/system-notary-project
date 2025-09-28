import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ProgressData {
  draft: number;
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
}

interface ProgressGaugeChartProps {
  data: ProgressData | null;
  loading: boolean;
}

export function ProgressGaugeChart({ data, loading }: ProgressGaugeChartProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  // Calculate total for percentage calculations
  const total = (data?.draft ?? 0) + 
                (data?.pending ?? 0) + 
                (data?.processing ?? 0) + 
                (data?.completed ?? 0) + 
                (data?.canceled ?? 0);

  // Calculate completion percentage (completed / total)
  const completionPercentage = total > 0 ? Math.round(((data?.completed ?? 0) / total) * 100) : 0;

  const chartData = {
    labels: ["Draft", "Pending", "Processing", "Completed", "Canceled"],
    datasets: [
      {
        data: [
          data?.draft ?? 0,
          data?.pending ?? 0,
          data?.processing ?? 0,
          data?.completed ?? 0,
          data?.canceled ?? 0,
        ],
        backgroundColor: [
          "rgba(156, 163, 175, 0.7)", // Gray for Draft
          "rgba(245, 158, 11, 0.7)",  // Yellow for Pending
          "rgba(59, 130, 246, 0.7)",  // Blue for Processing
          "rgba(16, 185, 129, 0.7)",  // Green for Completed
          "rgba(239, 68, 68, 0.7)",   // Red for Canceled
        ],
        borderColor: [
          "rgb(156, 163, 175)", // Gray for Draft
          "rgb(245, 158, 11)",  // Yellow for Pending
          "rgb(59, 130, 246)",  // Blue for Processing
          "rgb(16, 185, 129)",  // Green for Completed
          "rgb(239, 68, 68)",   // Red for Canceled
        ],
        borderWidth: 2,
        cutout: "70%", // Creates the gauge effect
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  // Custom plugin to add center text
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx;
      const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
      const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

      ctx.save();
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${completionPercentage}%`, centerX, centerY - 10);
      
      ctx.font = "14px Arial";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Completed", centerX, centerY + 20);
      ctx.restore();
    },
  };

  return (
    <div className="relative">
      <div style={{ height: "350px" }}>
        <Doughnut 
          data={chartData} 
          options={options} 
          plugins={[centerTextPlugin]}
        />
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">{data?.draft ?? 0}</div>
          <div className="text-sm text-gray-500">Draft</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-500">{data?.pending ?? 0}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{data?.processing ?? 0}</div>
          <div className="text-sm text-gray-500">Processing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{data?.completed ?? 0}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{data?.canceled ?? 0}</div>
          <div className="text-sm text-gray-500">Canceled</div>
        </div>
      </div>
    </div>
  );
}