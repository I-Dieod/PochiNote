// src/components/Signup/SignupForm.tsx

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { AuthActionProps } from "@/types";
import { UserNameAtom, MailAtom, PasswordAtom, ConfirmPasswordAtom, ErrorMessageAtom } from "@/atoms/auth/singup.atom";

export default function SignupForm({ action, onSubmit, onSuccess, onError }: AuthActionProps) {
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [email, setEMail] = useAtom(MailAtom);
    const [password, setPassword] = useAtom(PasswordAtom);
    const [confirmPassword, setConfirmPassword] = useAtom(ConfirmPasswordAtom);
    const [errorMessage, setErrorMessage] = useAtom(ErrorMessageAtom);
    // ローディング状態を管理
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);


    const router = useRouter();

    // クライアントサイドでのみルーターを使用可能にする
    useEffect(() => {
        setIsMounted(true);
    }, []);

    //  Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Send request for", { userName, email, password, confirmPassword });
        setIsLoading(true); // ローディング開始
        onSubmit(true);

        try {
            const response = await fetch(action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, password }),
            });

            if (!response.ok) {
                // エラー処理
                throw new Error("Request failed");
            }

            if (onSuccess) {
                const data = await response.json();
                onSuccess(data);
            } else {
                alert("Signup successful");
            }
            {/* TODO:サインアップ時にログインした状態でリダイレクトする処理を加える */}
            await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // 成功時のリダイレクト
            setTimeout(() => {
                if (isMounted && typeof window !== "undefined") {
                    router.push("/"); // ホームページへリダイレクト
                }
            }, 1000); // 1秒後にリダイレクト（ユーザーに成功メッセージを見せる時間）

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                if (onError) onError(error);
            }
            onSubmit(false);
        } finally {
            setIsLoading(false); // ローディング終了
        };
    }
    // Handle Reset Form
    const handleReset = () => {
        setUserName("");
        setEMail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        onSubmit(false);
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* エラーメッセージ表示 */}
            {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}
            <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">ユーザー名</label>
                <input type="text"
                    id="userName"
                    name="userName"
                    value={userName}
                    required
                    disabled={isLoading} // ローディング中は無効化

                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input type="email"
                    id="email"
                    name="email"
                    value={email}
                    required
                    disabled={isLoading}

                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setEMail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
                <input type="password"
                    id="password"
                    name="password"
                    value={password}
                    required
                    disabled={isLoading}

                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
                <input type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    required
                    disabled={isLoading}

                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="buttonGroup">
                <button type="submit"
                    className="w-full rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600 transition"
                    disabled={!userName || !email || !password || password !== confirmPassword}
                >
                    {isLoading ? (
                        <>
                            {/* ローディングスピナー */}
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            処理中...
                        </>
                    ) : (
                        "サインアップ"
                    )}
                </button>
                <button type="button"
                    className="w-full rounded-md bg-gray-500 py-2 text-white font-semibold hover:bg-gray-600 transition"
                    onClick={handleReset}
                >
                    リセット
                </button>
            </div>
        </form>
    );
}