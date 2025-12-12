"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Project as ProjectType } from "@/services/mockData";

interface ProgressChartProps {
    project: ProjectType;
}

export default function ProgressChart({ project }: ProgressChartProps) {
    const data = [
        {
            name: project.name,
            progress: project.progress, // 0-100
            fill: "#3b82f6",
        },
    ];

    return (
        <div className="relative w-full h-64 m-4">
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
                {project.progress}%
            </div>
        </div>
    );
}
