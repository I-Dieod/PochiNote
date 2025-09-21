// src/components/Login/LoginForm.tsx

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { AuthActionProps } from "@/types";
import { UserNameAtom, MailAtom, PasswordAtom, ErrorMessageAtom, authTokenAtom, isLogedInAtom } from "@/atoms/auth/auth.atom";

export default function LoginForm({ action, onSubmit, onSuccess, onError }: AuthActionProps) {
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [email, setEMail] = useAtom(MailAtom);
    const [password, setPassword] = useAtom(PasswordAtom);
    const [authToken, setAuthToken] = useAtom(authTokenAtom);
    const [errorMessage, setErrorMessage] = useAtom(ErrorMessageAtom);
    const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
    // ローディング状態を管理
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    // クライアントサイドでのみルーターを使用可能にする
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 認証情報を保存する関数
    const saveAuthData = (token: string, userData: { userName: string; email: string }) => {
        try {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
            console.error("Failed to save auth data:", error);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // ローディング開始

        onSubmit(true);
        try {
            const loginResponse = await fetch(action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!loginResponse.ok) {
                // エラー処理
                throw new Error("Request failed");
            }

            const loginData = await loginResponse.json();
            if (loginData.success) {
                if (loginData.token) {
                    setAuthToken(loginData.token);
                }
                setUserName(loginData.user.userName);
                setEMail(loginData.user.email);
                setIsLogedIn(true);

                // localStorageに保存
                saveAuthData(loginData.token, {
                    userName: loginData.user.userName,
                    email: loginData.user.email
                });

                if (onSuccess) {
                    onSuccess(loginData);
                } else {
                    alert("Login successful");
                }
            }

            // 成功時のリダイレクト
            setTimeout(() => {
                if (isMounted && typeof window !== "undefined") {
                    router.push("/"); // ホームページへリダイレクト
                }
            }, 1000); // 1秒後にリダイレクト（ユーザーに成功メッセージを見せる時間）

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                if (onError) onError({ message: error.message });
            }
            onSubmit(false);
        } finally {
            setIsLoading(false); // ローディング終了
        };
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* エラーメッセージ表示 */}
            {errorMessage && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input type="email"
                    id="email"
                    name="email"
                    value={email}
                    required
                    disabled={isLoading} // ローディング中は無効化

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
            <button type="submit"
                className="w-full rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600 transition"
                disabled={!email || !password}
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
                    "ログイン"
                )}
            </button>
        </form>
    );
}