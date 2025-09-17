// src/components/BalanceChart.tsx

"use client";

import React, { useEffect, useRef, useState } from 'react';
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

import { dropdownMenuAtom, dropdownOpenAtom, selectedPeriodAtom } from '@/atoms/BalanceChart.atom';
import { transactionsAtom } from '@/atoms/TransactionTable.atom';
import { authTokenAtom } from '@/atoms/auth/auth.atom';

const DropdownMenu = () => {
    const [dropdownOpen, setDropdownOpen] = useAtom(dropdownOpenAtom);
    const [dropdownMenuItems] = useAtom(dropdownMenuAtom);
    const [selectedPeriod, setSelectedPeriod] = useAtom(selectedPeriodAtom);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setDropdownOpen((open) => !open)}
                id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {selectedPeriod}
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
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    aria-labelledby='dropdownDefaultButton'
                                    onClick={() => {
                                        if (item.name === 'Week') setSelectedPeriod('Week');
                                        else if (item.name === 'Month') setSelectedPeriod('Month');
                                        else if (item.name === 'Year') setSelectedPeriod('Year');
                                        else setSelectedPeriod('Max');
                                    }}
                                >
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

export function BalanceChart() {
    const [authToken] = useAtom(authTokenAtom);

    const [transactions] = useAtom(transactionsAtom);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [selectedPeriod] = useAtom(selectedPeriodAtom);

    // 期間に応じた開始日を取得する関数を修正
    const getStartOfPeriod = () => {
        const today = new Date();

        switch (selectedPeriod) {
            case 'Week':
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                return new Date(today.setDate(diff));
            case 'Month':
                return new Date(today.getFullYear(), today.getMonth(), 1);
            case 'Year':
                return new Date(today.getFullYear(), 0, 1);
            case 'Max':
                return new Date(0); // 全期間を表示する場合は最古の日付
            default:
                return today;
        }
    };

    // 期間に応じた終了日を取得する関数を追加
    const getEndOfPeriod = (start: Date) => {
        const end = new Date();

        switch (selectedPeriod) {
            case 'Week':
                return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
            case 'Month':
                return new Date(end.getFullYear(), end.getMonth() + 1, 0);
            case 'Year':
                return new Date(end.getFullYear(), 11, 31);
            case 'Max':
                return new Date(); // 現在日付まで
            default:
                return end;
        }
    };

    // 開始日と終了日を設定
    const startDate = getStartOfPeriod();
    const endDate = getEndOfPeriod(startDate);

    const calcBalances = async (data: typeof transactions) => {
        // 日付でソートされた取引配列を作成
        const sortedTransactions = [...data].sort((a, b) =>
            new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
        );

        // 日付ごとの残高を計算
        const dailyBalances = new Map<string, number>();
        let runningBalance = 0;

        // 期間に応じて日付を生成し、前日の残高を引き継ぐ
        const currentDate = new Date(startDate);
        let previousBalance = 0;

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];

            // その日の取引を集計
            const dayTransactions = sortedTransactions.filter(transaction => {
                const transDate = new Date(transaction.transactionDate);
                return transDate.toISOString().split('T')[0] === dateStr;
            });

            // その日の取引がある場合は計算、ない場合は前日の残高を使用
            if (dayTransactions.length > 0) {
                dayTransactions.forEach(transaction => {
                    const amount = Number(transaction.amount);
                    runningBalance += transaction.transactionType === 'income' ? amount : -amount;
                });
                previousBalance = runningBalance;
            } else {
                runningBalance = previousBalance;
            }

            dailyBalances.set(dateStr, runningBalance);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 最終残高をDBに保存
        try {
            const response = await fetch('/api/data/editProperty/updateCurrentProperty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    currentProperty: runningBalance
                })
            });

            if (!response.ok) {
                console.error('Failed to update current property');
            }
        } catch (error) {
            console.error('Error updating current property:', error);
        }

        return Array.from(dailyBalances.entries())
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, balance]) => ({ date, balance }));
    };

    const [balanceDataList, setBalanceDataList] = useState<{ date: string; balance: number }[]>([]);

    useEffect(() => {
        const fetchBalances = async () => {
            const data = await calcBalances(transactions);
            setBalanceDataList(data);
            balanceDataList.splice(0, balanceDataList.length, ...data);
        };
        fetchBalances();
    }, [transactions]);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.clientWidth);
            }
        };

        // 初期サイズを設定
        updateDimensions();

        // ウィンドウリサイズ時にサイズを更新
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);


    return (
        <div className="md:w-2/3 sm:w-1/3 rounded-md border-double border-4 border-gray-200">
            <DropdownMenu />
            <div ref={containerRef} className="container md:h-full md:w-full overflow-x-auto">
                <LineChart
                    width={chartWidth || 0}
                    height={500}
                    data={balanceDataList}
                    margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => new Date(date).toLocaleDateString('ja-JP')}
                        domain={[startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]}
                    />
                    <YAxis
                        dataKey="balance"
                        tickFormatter={(value) => `¥${value.toLocaleString()}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#4bf3c1ff"
                        strokeWidth={2}
                    />
                    <Legend />
                    <Tooltip
                        formatter={(value) => [`¥${Number(value).toLocaleString()}`, '残高']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                </LineChart>
            </div>
        </div>
    );
};