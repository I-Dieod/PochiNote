// src/components/BalanceChart.tsx

"use client";

import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { atom, useAtom } from 'jotai';

import BalanceDataList from '@/lib/BalanceDataList';
import { DropdownMenu } from '@/atoms/BalanceChart.atom';


const BalanceChart = () => (
    <div className="md:w-2/3 sm:w-1/3 rounded-md border-double border-4 border-gray-200">
        <div className="flex gap-2">
            <h1>Single Area Chart</h1>
            <DropdownMenu />
        </div>

        <div className="container md:h-full md:w-full overflow-x-auto">
            <LineChart
                width={1150}
                height={500}
                data={BalanceDataList}
                margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis dataKey="balance" />
                <Line type="monotone" dataKey="balance" stroke="#4bf3c1ff" strokeWidth={2} />
                <Legend />
                <Tooltip />
            </LineChart>
        </div>
    </div>
);

export default BalanceChart;