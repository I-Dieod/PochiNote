// src/components/Home/SideBar.tsx

"use client";

import { useAtom } from "jotai";

import {
  isLogedInAtom,
  authTokenAtom,
  UserNameAtom,
} from "@/atoms/auth/auth.atom";
import { deleteAuthToken } from "@/lib/middleware/authMiddleware";

export default function SideBar() {
  // ユーザー状態
  const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const [userName, setUserName] = useAtom(UserNameAtom);
  // ログアウト処理
  const handleLogout = async () => {
    console.log("Send logout request for", { authToken });
    try {
      // サーバーサイドのログアウト処理
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // トークンを送信
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // クライアントサイドのクリーンアップ
      // localStorage/sessionStorageのクリア（もし使用している場合）
      deleteAuthToken();

      // Atomのリセット
      setIsLogedIn(false);
      setAuthToken("");
      setUserName("");

      // next/routerを使用したリダイレクト
      window.location.href = "/"; // または認証が必要なページからログインページへ
    } catch (error) {
      console.error("Logout failed:", error);
      // エラー処理（必要に応じてユーザーに通知）
    }
  };

  return (
    <>
      <div
        id="Main-Container"
        className="relative sm:h-full sm:flex sm:w-64 sm:flex-col justify-between sm:fixed bg-white"
      >
        <div
          id="header"
          className="flex justify-items-start h-16 px-4 pt-2  dark:bg-gray-900"
        >
          <img src="/Logo.svg" alt="Logo" className="h-10 w-10 mx-2 my-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white my-3">
            PochiNote
          </h2>
        </div>
        <div id="Menu-box" className="flex flex-col gap-2 m-2">
          <a href="/">
            <div
              id="Dashboard"
              className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Dashboard
            </div>
          </a>
          <div
            id="Manage-Report"
            className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Manage Report
          </div>
          <div
            id="Analytics"
            className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Analytics
          </div>
          <a href="/settings" className="w-full h-full">
            <div
              id="Settings"
              className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Settings
            </div>
          </a>
        </div>
        <div id="Footer" className="flex-col mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-500 my-2 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
          <p className="text-sm text-gray-500">© 2025 PochiNote</p>
        </div>
      </div>
    </>
  );
}
