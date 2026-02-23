"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  activeJobs: number;
  completedJobs: number;
  totalJobs: number;
}

const COLORS = ["#2dd4bf", "#189294", "#0f766e"];

export default function JobDistributionChart({
  activeJobs,
  completedJobs,
  totalJobs,
}: Props) {
  const openJobs = Math.max(0, totalJobs - activeJobs - completedJobs);

  const data = [
    { name: "Open", value: openJobs },
    { name: "In Progress", value: activeJobs },
    { name: "Completed", value: completedJobs },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
