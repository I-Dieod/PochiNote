// src/components/Home/SubComponents/AddData.tsx

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { DataActionProps } from "@/types";
import { UserNameAtom, MailAtom, authTokenAtom } from "@/atoms/auth/auth.atom";
import { showAddFormAtom, categoriesAtom } from "@/atoms/TransactionTable.atom";

interface TransactionData {
    transactionType: "income" | "expense";
    amount: string;
    categoryId: number;  // string から number に変更
    description: string;
    transactionDate: string;
}

export default function AddDataForm({ action, onSubmit, onSuccess, onError, onClose }: DataActionProps) {
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [email, setEMail] = useAtom(MailAtom);
    const [authToken, setAuthToken] = useAtom(authTokenAtom);
    const [showAddForm, setShowAddForm] = useAtom(showAddFormAtom);
    const [categories, setCategories] = useAtom(categoriesAtom);

    // ローディング状態を管理
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // フォームデータの状態管理
    const [formData, setFormData] = useState<TransactionData>({
        transactionType: "expense",
        amount: "",
        categoryId: 0,  // 空の値として0を使用
        description: "",
        transactionDate: new Date().toISOString().split('T')[0]
    });

    // APIからカテゴリを取得
    useEffect(() => {
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

        fetchCategories();
    }, [setCategories]);

    // モーダル外クリックで閉じる
    const handleBGClick = () => {
        setShowAddForm(false);
    }
    const handleClickForm = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'categoryId' ? Number(value) : value,
            // 取引種別が変わったらカテゴリをリセット
            ...(name === 'transactionType' ? { categoryId: 0 } : {})
        }));
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
                transactionType: formData.transactionType,
                amount: formData.amount,
                categoryId: formData.categoryId,  // すでにnumber型なのでparseInt不要
                description: formData.description || null,
                transactionDate: formData.transactionDate
            }

            console.log("Send request for", requestBody);
            const dataAddResponse = await fetch(action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!dataAddResponse.ok) {
                throw new Error("取引の登録に失敗しました");
            }

            const result = await dataAddResponse.json();

            // 成功時の処理
            const newTransaction = {
                ...result,
                categoryName: categories[formData.transactionType].find(c => c.categoryId === formData.categoryId)?.categoryName || ""
            };

            onSuccess(newTransaction);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "エラーが発生しました";
            setError(errorMessage);
            onError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50"
            onClick={handleBGClick}
        >
            <div
                id="Form"
                className="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700"
                onClick={handleClickForm}
            >
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        新しい取引を追加
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* フォーム */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* 取引種別 */}
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
                            {categories[formData.transactionType].map(category => (
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
                            step="0.01"
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
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="詳細な説明を入力してください"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                    </div>

                    {/* ボタン */}
                    <div className="flex justify-end space-x-2 pt-4">
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
                            {isLoading ? "登録中..." : "登録する"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}