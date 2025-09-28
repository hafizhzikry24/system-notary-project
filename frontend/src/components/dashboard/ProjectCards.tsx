import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, HandshakeIcon, ScrollText, Loader2 } from "lucide-react";

interface ProjectData {
  worksheet: number;
  customer: number;
  partner: number;
  template_deed: number;
}

interface ProjectCardsProps {
  data: ProjectData | null;
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

export function ProjectCards({ data, loading }: ProjectCardsProps) {
  const items = [
    {
      label: "Total Worksheets",
      value: data?.worksheet ?? 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Customers",
      value: data?.customer ?? 0,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Partners",
      value: data?.partner ?? 0,
      icon: HandshakeIcon,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Template Deeds",
      value: data?.template_deed ?? 0,
      icon: ScrollText,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const animatedValue = useCountUp(item.value);
        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <div className={`p-2 rounded-full ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
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