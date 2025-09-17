// src/components/CircleChart.tsx

"use client";

import { useAtom } from 'jotai';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categoriesAtom, transactionsAtom } from '@/atoms/TransactionTable.atom';
import { useMemo } from 'react';

export const CircleChart = () => {
    const [categories] = useAtom(categoriesAtom);
    const [transactions] = useAtom(transactionsAtom);

    // useMemoを使用してデータの計算を最適化
    const { categoryData, typeData } = useMemo(() => {
        const categoryTotals = transactions.reduce((acc, transaction) => {
            const categoryId = transaction.categoryId;
            const amount = Number(transaction.amount);
            
            if (!acc[categoryId]) {
                acc[categoryId] = 0;
            }
            acc[categoryId] += amount;
            return acc;
        }, {} as Record<number, number>);

        const categoryData = Object.entries(categoryTotals).map(([categoryId, total]) => {
            const category = [...categories.income, ...categories.expense]
                .find(cat => cat.categoryId === Number(categoryId));
            return {
                name: category?.categoryName || 'Unknown',
                value: total,
                type: category?.categoryType || 'Unknown'
            };
        });

        const typeTotals = transactions.reduce((acc, transaction) => {
            const type = transaction.transactionType;
            const amount = Number(transaction.amount);
            
            if (!acc[type]) {
                acc[type] = 0;
            }
            acc[type] += amount;
            return acc;
        }, {} as Record<string, number>);

        const typeData = Object.entries(typeTotals).map(([type, total]) => ({
            name: type === 'income' ? '収入' : '支出',
            value: total,
        }));

        return { categoryData, typeData };
    }, [transactions, categories]);

    // カラーパレット
    const CATEGORY_COLORS = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9EA1D4', '#A8E6CF', '#FF8B94', '#FFDAC1'
    ];

    const TYPE_COLORS = ['#82ca9d', '#ff7675'];

    return (
        <div className="md:w-1/3 rounded-md border-double border-4 border-gray-200">
            <h1 className="text-center font-bold p-2">収支グラフ</h1>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    {/* カテゴリー別の内側の円 */}
                    <Pie
                        data={categoryData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={90}
                        label={(entry) => entry.name}
                        startAngle={90}
                        endAngle={450}
                    >
                        {categoryData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            />
                        ))}
                    </Pie>

                    {/* 収支別の外側の円 */}
                    <Pie
                        data={typeData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={120}
                        label
                        startAngle={90}
                        endAngle={450}
                    >
                        {typeData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value) => `¥${Number(value).toLocaleString()}`}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
