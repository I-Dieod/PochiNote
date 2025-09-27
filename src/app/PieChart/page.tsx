// src/app/PieChart/page.tsx

import { CircleChart } from "@/components/Home/CircleChart";

export default function PieChartPage() {
    return (
        <div className="flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-900">
            <h1 className="text-2xl font-bold">収支グラフ</h1>
            <CircleChart />
        </div>
    );
}