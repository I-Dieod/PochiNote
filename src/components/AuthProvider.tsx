// src/components/AuthProvider.tsx

"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { authTokenAtom, isLogedInAtom, MailAtom } from "@/atoms/auth/auth.atom";
import { UserNameAtom } from "@/atoms/auth/auth.atom";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
    const [authToken, setAuthToken] = useAtom(authTokenAtom);
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [email, setEmail] = useAtom(MailAtom);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // まず必ず認証状態を初期化
                console.log("Initializing auth state...");
                setIsLogedIn(false);
                setAuthToken("");
                setUserName("");
                setEmail("");

                const storedToken = localStorage.getItem("authToken");
                const storedUser = localStorage.getItem("userData");

                // トークンが存在しない場合は初期化終了
                if (!storedToken || !storedUser) {
                    console.log("No stored credentials found, staying logged out");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userData");
                    return; // ここで処理終了、isLogedInはfalseのまま
                }
                // トークンが存在する場合のみ検証を行う
                const userData = JSON.parse(storedUser);
                console.log("Verifying stored token for user:", userData.userName);

                const verifyResponse = await fetch("/api/auth/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${storedToken}`
                    }
                });

                console.log("Verify response status:", verifyResponse.status);


                if (verifyResponse.ok) {
                    const verifyData = await verifyResponse.json();
                    console.log("Verify response data:", verifyData);

                    if (verifyData.success) {
                        // 検証成功の場合のみログイン状態にする
                        console.log("Token verification successful, logging in user");
                        setAuthToken(storedToken);
                        setUserName(userData.userName);
                        setEmail(userData.email);
                        setIsLogedIn(true);
                    } else {
                        // 検証失敗の場合はクリア
                        console.log("Token verification failed:", verifyData.error);
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("userData");
                        // setIsLogedIn(false) は既に上で設定済み
                    }
                } else {
                    // HTTPエラーの場合もクリア
                    console.log("Token verification request failed with status:", verifyResponse.status);
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userData");
                    // setIsLogedIn(false) は既に上で設定済み
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                // エラーの場合、保存された情報をクリア
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                setIsLogedIn(false);
                setAuthToken("");
                setUserName("");
                setEmail("");
            } finally {
                console.log("Auth initialization completed");
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [setIsLogedIn, setAuthToken, setUserName, setEmail]);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
}