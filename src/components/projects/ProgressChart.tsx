"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Task } from "@/services/mockData";

interface ProgressChartProps {
    task: Task;
}

export default function ProgressChart({ task }: ProgressChartProps) {
    const data = [
        {
            name: task.name,
            progress: task.progress, // 0-100
            fill: "#3b82f6",
        },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={20}
                    data={data}
                    startAngle={180}
                    endAngle={0} // semicircle
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickCount={6}
                    />
                    <RadialBar
                        dataKey="progress"
                        cornerRadius={10}
                        background={{ fill: "#e5e7eb" }}
                    />
                </RadialBarChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-800">
                {task.progress}%
            </div>
        </div>
    );
}
