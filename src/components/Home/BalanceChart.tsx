// src/components/BalanceChart.tsx

"use client";

import React from 'react';
import { useAtom } from 'jotai';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import BalanceDataList from '@/lib/BalanceDataList';
import { dropdownMenuAtom, dropdownOpenAtom } from '@/atoms/BalanceChart.atom';

const DropdownMenu = () => {
    const [dropdownOpen, setDropdownOpen] = useAtom(dropdownOpenAtom);
    const [dropdownMenuItems] = useAtom(dropdownMenuAtom)
    
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setDropdownOpen((open) => !open)}
                id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                Periods
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
                <div id="dropdown" className="absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700" >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {dropdownMenuItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    aria-labelledby='dropdownDefaultButton'>
                                    {item.name}
                                </a>
                            </ li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const BalanceChart = () => (
    <div className="md:w-2/3 sm:w-1/3 rounded-md border-double border-4 border-gray-200">
        <div className="flex grid grid-flow-col gap-2">
            <div className="justify-items-start p-4">
                <h1>Single Area Chart</h1>
            </div>
            <div className="justify-items-end-safe p-2 ">
                <DropdownMenu />
            </div>
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