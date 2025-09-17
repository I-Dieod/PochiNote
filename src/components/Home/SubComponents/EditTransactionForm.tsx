// src/components/Home/SubComponents/EditTransactionForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { DataActionProps, Transaction } from "@/types";
import { categoriesAtom, showEditFormAtom } from "@/atoms/TransactionTable.atom";
import { authTokenAtom, MailAtom, UserNameAtom } from "@/atoms/auth/auth.atom";
import { trace } from "console";

export default function EditTransactionForm({ action, onSubmit, target, onSuccess, onError, onClose }: DataActionProps) {
    const [userName] = useAtom(UserNameAtom);
    const [email] = useAtom(MailAtom);
    const [authToken] = useAtom(authTokenAtom);
    const [showEditForm, setShowEditForm] = useAtom(showEditFormAtom);
        const [categories, setCategories] = useAtom(categoriesAtom);
    

    // ローディング状態を管理
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // フォームデータの状態管理
    const [formData, setFormData] = useState<Transaction>({
        transactionId: 0, 
        transactionType: "expense",
        amount: "",
        categoryId: 0,  // 空の値として0を使用
        description: "",
        transactionDate: new Date().toISOString().split('T')[0]
    });

    const fetchCategories = async () => {
            try {
                const response = await fetch("/api/data/fetchCategories");
                if (response.ok) {
                    const fetchCategoriesData = await response.json();
                    setCategories(fetchCategoriesData);
                    console.log("Fetching categories from API:", { fetchCategoriesData, categories });

                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setError('カテゴリの取得に失敗しました');
            }
        };
    
    const getTargetTransactionData = async (transactionId: number) => {
        if (target === null) return;
        try {
            setFormData({
                transactionId: target.transactionId,
                transactionType: target.transactionType,
                amount: target.amount,
                categoryId: target.categoryId,
                description: target.description || "",
                transactionDate: target.transactionDate.split('T')[0]
            });
        } catch (error) {
            console.error("Error fetching target transaction data:", error);
            setError("取引データの取得に失敗しました。");
        }
    };

    useEffect(() => {
        if (target) {
            getTargetTransactionData(target.transactionId);
        }
        fetchCategories();
    }, [target]);

    // targetが変更されたときに対象の取引データを取得してフォームにセット
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // モーダル外クリックで閉じる
    const handleBGClick = () => {
        setShowEditForm(false);
    }
    const handleClickForm = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Send request to adding data for", { userName, email, authToken })
        setIsLoading(true);
        setError("");
        onSubmit(true);

        try {
            const requestBody = {
                userName: userName,
                transactionId: formData.transactionId,
                transactionType: formData.transactionType,
                amount: formData.amount,
                categoryId: formData.categoryId,
                description: formData.description || null,
                transactionDate: formData.transactionDate
            }
                        console.log("Send request for", requestBody);

            const dataEditResponse = await fetch(action, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!dataEditResponse.ok) {
                throw new Error("取引の編集に失敗しました");
            }

            const result = await dataEditResponse.json();

            // 成功時の処理
            const updatedTransaction = {
                ...result,
                categoryName: categories[formData.transactionType].find(c => c.categoryId === formData.categoryId)?.categoryName || ""
            };

            onSuccess(updatedTransaction);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
            setError(errorMessage);
            onError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // TODO: 削除ボタンの追加
    // TODO: フォームのUIをAddと区別できるように変更
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50"
            onClick={handleBGClick}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full dark:bg-gray-700"
                onClick={handleClickForm}
            >
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        取引データを編集
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* フォーム本体 */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* 取引種別 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                取引種別 *
                            </label>
                            <select
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option value="expense">支出</option>
                                <option value="income">収入</option>
                            </select>
                        </div>

                        {/* カテゴリ */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                カテゴリ *
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option value="">カテゴリを選択してください</option>
                                {categories[formData.transactionType]?.map(category => (
                                    <option key={category.categoryId} value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 金額 */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                金額（円）*
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                required
                                min="0"
                                placeholder="1000"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                        </div>

                        {/* 取引日 */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                取引日 *
                            </label>
                            <input
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                        </div>

                        {/* 説明 */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                説明
                            </label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="詳細な説明を入力してください"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* ボタングループ */}
                    <div className="flex justify-end space-x-2 pt-6 mt-4 border-t dark:border-gray-600">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {isLoading ? "保存中..." : "変更を保存"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}