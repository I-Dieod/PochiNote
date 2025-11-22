// src/components/BalanceChart.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DropdownMenu } from "./SubComponents/DropDownMenu";
import { goalsAtom, selectedPeriodAtom } from "@/atoms/BalanceChart.atom";
import { transactionsAtom } from "@/atoms/TransactionTable.atom";
import { authTokenAtom, UserNameAtom } from "@/atoms/auth/auth.atom";

export function BalanceChart() {
  const [userName] = useAtom(UserNameAtom);
  const [authToken] = useAtom(authTokenAtom);

  const [transactions] = useAtom(transactionsAtom);
  const [goals, setGoals] = useAtom(goalsAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(500);
  const [selectedPeriod] = useAtom(selectedPeriodAtom);

  // 期間に応じた開始日を取得する関数を修正
  const getStartOfPeriod = () => {
    const today = new Date();

    switch (selectedPeriod) {
      case "Week":
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
      case "Month":
        return new Date(today.getFullYear(), today.getMonth(), 1);
      case "Year":
        return new Date(today.getFullYear(), 0, 1);
      case "Max":
        return new Date(0); // 全期間を表示する場合は最古の日付
      default:
        return today;
    }
  };

  // 期間に応じた終了日を取得する関数を追加
  const getEndOfPeriod = (start: Date) => {
    const end = new Date();

    switch (selectedPeriod) {
      case "Week":
        return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      case "Month":
        return new Date(end.getFullYear(), end.getMonth() + 1, 0);
      case "Year":
        return new Date(end.getFullYear(), 11, 31);
      case "Max":
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
    const sortedTransactions = [...data].sort(
      (a, b) =>
        new Date(a.transactionDate).getTime() -
        new Date(b.transactionDate).getTime(),
    );

    // 日付ごとの残高を計算
    const dailyBalances = new Map<string, number>();
    let runningBalance = 0;

    // 期間に応じて日付を生成し、前日の残高を引き継ぐ
    const currentDate = new Date(startDate);
    let previousBalance = 0;

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // その日の取引を集計
      const dayTransactions = sortedTransactions.filter((transaction) => {
        const transDate = new Date(transaction.transactionDate);
        return transDate.toISOString().split("T")[0] === dateStr;
      });

      // その日の取引がある場合は計算、ない場合は前日の残高を使用
      if (dayTransactions.length > 0) {
        dayTransactions.forEach((transaction) => {
          const amount = Number(transaction.amount);
          runningBalance +=
            transaction.transactionType === "income" ? amount : -amount;
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
      const response = await fetch("/api/data/update/currentProperty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentProperty: runningBalance,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update current property");
      }
    } catch (error) {
      console.error("Error updating current property:", error);
    }

    return Array.from(dailyBalances.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, balance]) => ({ date, balance }));
  };

  const [balanceDataList, setBalanceDataList] = useState<
    { date: string; balance: number; goalAmount?: number }[]
  >([]);

  // 目標資産額を期間に応じて計算する関数
  const calcGoalData = () => {
    if (!goals?.propertyGoal) return [];

    const goalAmount = Number(goals.propertyGoal);
    const goalDataList: {
      date: string;
      balance: number;
      goalAmount: number;
    }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      goalDataList.push({
        date: dateStr,
        balance: 0, // balanceは使わないが型の互換性のため
        goalAmount: goalAmount,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return goalDataList;
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const balanceData = await calcBalances(transactions);
      const goalData = calcGoalData();

      // balanceDataとgoalDataを結合
      const mergedData = balanceData.map((item) => {
        const goalItem = goalData.find((goal) => goal.date === item.date);
        return {
          ...item,
          goalAmount: goalItem?.goalAmount,
        };
      });

      setBalanceDataList(mergedData);
    };
    fetchBalances();
  }, [transactions, selectedPeriod, goals]); // goalsも依存配列に追加

  const getGoals = async () => {
    if (!userName || !authToken) {
      console.log("Missing userName or authToken, skipping data fetch");
      return;
    }

    try {
      const fetchGoalResponse = await fetch(
        `/api/settings/getGoals?userName=${encodeURIComponent(userName)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (fetchGoalResponse.ok) {
        const response = await fetchGoalResponse.json();
        setGoals(response.goalData);
        console.log("Fetching user's goal from API:", response.goalData);
      }
    } catch (error) {
      console.error("Error fetching user's goal:", error);
    }
  };

  useEffect(() => {
    getGoals();
  }, [userName, authToken]); // userNameまたはauthTokenが変更された時のみ実行

  // より細かいブレークポイント対応
  const getResponsiveHeight = () => {
    const width = window.innerWidth;
    if (width < 480) return 250; // xs
    if (width < 640) return 300; // sm
    if (width < 768) return 400; // md
    return 500; // lg以上
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.clientWidth);
        // 画面幅に応じて高さを調整
        setChartHeight(getResponsiveHeight());
      }
    };

    // 初期サイズを設定
    updateDimensions();

    // ウィンドウリサイズ時にサイズを更新
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="w-full h-full shadow-lg sm:rounded-lg z-10 bg-white dark:bg-gray-800 p-2">
      <div
        id="chart-header"
        className="flex justify-between items-center border-dashed border-2 border-gray-200 rounded-t-lg "
      >
        <h1 className="text-center font-bold p-4">資産推移</h1>
        <div className="justify-end p-2 ">
          <DropdownMenu />
        </div>
      </div>
      <div
        ref={containerRef}
        className="container md:h-full md:w-full overflow-x-auto"
      >
        <LineChart
          width={chartWidth || 0}
          height={chartHeight}
          data={balanceDataList}
          margin={{
            top: 15,
            right: 30,
            left: 30,
            bottom: 15,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-30}
            tickFormatter={(date) => new Date(date).toLocaleDateString("ja-JP")}
            domain={[
              startDate.toISOString().split("T")[0],
              endDate.toISOString().split("T")[0],
            ]}
          />
          <YAxis
            dataKey="balance"
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          {/* TODO: Periodに応じてラインタイプを変える */}
          {/* 資産推移ライン */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#37b18cff"
            strokeWidth={2}
            dot={false} // 通常時のポイントを非表示
            activeDot={{
              // ホバー時のポイントをカスタマイズ
              r: 6,
              stroke: "#37b18cff",
              strokeWidth: 2,
              fill: "white",
            }}
          />
          {/* 目標資産額ライン */}
          {goals?.propertyGoal && (
            <Line
              type="monotone"
              dataKey="goalAmount"
              stroke="#ff6b6b"
              strokeWidth={2}
              strokeDasharray="5 5" // 破線スタイル
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#ff6b6b",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          )}
          <Tooltip
            formatter={(value, name) => {
              if (name === "goalAmount") {
                return [`¥${Number(value).toLocaleString()}`, "目標資産額"];
              }
              return [`¥${Number(value).toLocaleString()}`, "資産額"];
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            cursor={{ stroke: "#37b18cff", strokeDasharray: "3 3" }} // ホバー時の縦線をカスタマイズ
          />
        </LineChart>
      </div>
    </div>
  );
}
