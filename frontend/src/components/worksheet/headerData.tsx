import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface HeaderDataProps {
  headerData: {
    draft: number;
    pending: number;
    processing: number;
    completed: number;
    canceled: number;
  } | null;
  loading: boolean;
}

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * (target - start) + start);
      setCount(current);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}

export function MonitoringHeaderCards({ headerData, loading }: HeaderDataProps) {
  const items = [
    {
      label: "Draft",
      value: headerData?.draft ?? 0,
      icon: FileText,
      color: "text-gray-600",
      bg: "bg-gray-100 dark:bg-gray-800",
    },
    {
      label: "Pending",
      value: headerData?.pending ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      label: "Processing",
      value: headerData?.processing ?? 0,
      icon: Loader2,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      label: "Completed",
      value: headerData?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      label: "Canceled",
      value: headerData?.canceled ?? 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const animatedValue = useCountUp(item.value, 100); // 1s animation
        return (
          <Card key={item.label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <div className={`p-2 rounded-full ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin text-neutral-400" />
              ) : (
                <div className="text-2xl font-bold">{animatedValue}</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}