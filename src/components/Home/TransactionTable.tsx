// src/components/TransactionTable.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";

import { showAddFormAtom, transactionsAtom } from "@/atoms/TransactionTable.atom";
import AddDataForm from "@/components/Home/SubComponents/AddDataForm";
import { authTokenAtom, UserNameAtom } from "@/atoms/auth/auth.atom";

interface Transaction {
    transactionId: number;
    transactionType: "income" | "expense";
    amount: string;
    categoryName: string;
    description?: string;
    transactionDate: string;
}

export default function TransactionTable() {
    const [authToken, setAuthToken] = useAtom(authTokenAtom);
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [showAddForm, setShowAddForm] = useAtom(showAddFormAtom);
    const [transactions, setTransactions] = useAtom(transactionsAtom);
    const [submitted, setSubmitted] = useState(false);

    const [error, setError] = useState(null as string | null);
    const [loading, setLoading] = useState(false);

    // 取引リストを取得
    const fetchTransactions = useCallback(async () => {
        if (!userName || !authToken) {
            console.log("Missing userName or authToken, skipping data fetch");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/data/fetch?userName=${encodeURIComponent(userName)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const fetchData = await response.json();
                if (fetchData.success) {
                    setTransactions(fetchData.data || []);
                    console.log(`Loaded ${fetchData.data?.length || 0} transactions for ${userName}`);
                } else {
                    console.warn("API returned success: false", fetchData.error);
                    setTransactions([]);
                    setError(fetchData.error);
                }

            } else {
                const errorText = await response.text();
                console.error(`API request failed: ${response.status}`, errorText);
                setError(`Failed to fetch data: ${response.status}`);
                setTransactions([]);
            }
        } catch (fetchError) {
            console.error('Data fetch failed:', fetchError);
            setError('Network error occurred');
            setTransactions([]);
        } finally {
            setLoading(false);
        }

    }, [authToken, userName, setTransactions, setError, setLoading]);

    // 初回レンダリング時とauthToken/userNameが変更された時にデータを取得
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleAddSuccess = (newTransaction: Transaction) => {
        console.log('Transaction added successfully:', newTransaction);
        // データを再取得して最新の状態を反映
        fetchTransactions();
        setShowAddForm(false);
    };

    const handleAddError = (error: string) => {
        console.error("取引追加エラー:", error);
        // エラー処理（トーストやアラートを表示）
    };

    const formatAmount = (amount: string, type: "income" | "expense") => {
        // 数値変換可能かチェック
        const numAmount = Number(amount);
        if (isNaN(numAmount)) {
            console.warn('Invalid amount:', amount);
            return <span className="text-gray-500">¥-</span>;
        }

        const formattedAmount = `¥${numAmount.toLocaleString()}`;
        return type === "income" ? (
            <span className="text-green-600 font-medium">+{formattedAmount}</span>
        ) : (
            <span className="text-red-600 font-medium">-{formattedAmount}</span>
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', dateString);
            return '-';
        }

        return date.toLocaleDateString('ja-JP');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">取引履歴</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        取引を追加
                    </button>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">日付</th>
                            <th scope="col" className="px-6 py-3">種別</th>
                            <th scope="col" className="px-6 py-3">説明</th>
                            <th scope="col" className="px-6 py-3">カテゴリ</th>
                            <th scope="col" className="px-6 py-3">金額</th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">操作</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ?
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    取引データがありません。取引を追加してください。
                                </td>
                            </tr>
                            : transactions.map((transaction) => (
                                <tr
                                    key={transaction.transactionId}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {formatDate(transaction.transactionDate)}
                                    </th>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${transaction.transactionType === 'income'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                            {transaction.transactionType === 'income' ? '収入' : '支出'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{transaction.description || '-'}</td>
                                    <td className="px-6 py-4">{transaction.categoryName}</td>
                                    <td className="px-6 py-4">
                                        {formatAmount(transaction.amount, transaction.transactionType)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">編集</a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* ポップアップフォーム */}
            {showAddForm && (
                <AddDataForm
                    action="/api/data/add"
                    onSubmit={setSubmitted}
                    onSuccess={(newTransaction) => {
                        console.log('AddDataForm success callback:', newTransaction);
                        handleAddSuccess(newTransaction);
                    }}
                    onError={(error) => console.error("Data add error:", error)}
                    onClose={() => setShowAddForm(false)}
                />
            )}
        </>
    );
}