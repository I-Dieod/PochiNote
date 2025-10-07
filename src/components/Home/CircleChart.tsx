// src/components/CircleChart.tsx

"use client";

import { useAtom } from "jotai";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { useMemo, useState } from "react";

import {
  categoriesAtom,
  transactionsAtom,
} from "@/atoms/TransactionTable.atom";
import { PieSectorData } from "@/types";

const renderActiveShapes = (props: PieSectorData) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const RADIN = Math.PI / 180;
  const sin = Math.sin(-RADIN * (midAngle ?? 0));
  const cos = Math.cos(-RADIN * (midAngle ?? 0));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {/* カテゴリー名表示 */}
      <text
        x={cx}
        y={cy! - 7}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-medium"
      >
        {payload.name}
      </text>

      {/* 金額表示 */}
      <text
        x={cx}
        y={cy! + 10}
        textAnchor="middle"
        fill={fill}
        className="text-base font-bold"
      >
        {`¥${Number(value).toLocaleString()}`}
      </text>
      {/* パーセンテージ表示 */}
      <text
        x={cx}
        y={cy! + 25}
        textAnchor="middle"
        fill={fill}
        className="text-xs"
      >
        {`(${(percent ? percent * 100 : 0).toFixed(1)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
    </g>
  );
};

export const CircleChart = () => {
  const [categories] = useAtom(categoriesAtom);
  const [transactions] = useAtom(transactionsAtom);

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // useMemoを使用してデータの計算を最適化
  const { categoryData, typeData } = useMemo(() => {
    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        const categoryId = transaction.categoryId;
        const amount = Number(transaction.amount);

        if (!acc[categoryId]) {
          acc[categoryId] = 0;
        }
        acc[categoryId] += amount;
        return acc;
      },
      {} as Record<number, number>,
    );

    const categoryData = Object.entries(categoryTotals).map(
      ([categoryId, total]) => {
        const category = [...categories.income, ...categories.expense].find(
          (cat) => cat.categoryId === Number(categoryId),
        );
        return {
          name: category?.categoryName || "Unknown",
          value: total,
          type: category?.categoryType || "Unknown",
        };
      },
    );

    const typeTotals = transactions.reduce(
      (acc, transaction) => {
        const type = transaction.transactionType;
        const amount = Number(transaction.amount);

        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const typeData = Object.entries(typeTotals).map(([type, total]) => ({
      name: type === "income" ? "収入" : "支出",
      value: total,
    }));

    return { categoryData, typeData };
  }, [transactions, categories]);

  // カラーパレット
  // TODO:  カテゴリーカラーがチャートの項目数に応じて変化しているので、初めから固定にする
  const CATEGORY_COLORS = [
    "#45B7D1",
    "#4ECDC4",
    "#FF6B6B",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9EA1D4",
    "#A8E6CF",
    "#FF8B94",
    "#FFDAC1",
  ];

  const TYPE_COLORS = ["#82ca9d", "#ff7675"];

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full h-full shadow-lg rounded-lg z-10 bg-white dark:bg-gray-800 p-2">
      <h1 className="text-center font-bold p-2">収支グラフ</h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          {/* カテゴリー別の内側の円 */}
          <Pie
            activeShape={renderActiveShapes}
            data={categoryData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            startAngle={90}
            endAngle={450}
            onMouseEnter={onPieEnter}
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
            innerRadius={120}
            outerRadius={140}
            startAngle={90}
            endAngle={450}
            label={(entry) => entry.name}
          >
            {typeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={TYPE_COLORS[index % TYPE_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
