// src/components/NavBar.tsx

"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAtom } from "jotai";
import { ChevronsRight } from 'lucide-react';

import { UserNameAtom, authTokenAtom, isLogedInAtom } from '@/atoms/auth/auth.atom';
import { deleteAuthToken } from '@/lib/middleware/authMiddleware';

const navigation = [
    { name: 'Dashboard', href: '#' },
    { name: 'Team', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Calendar', href: '#' },
]

export default function NavBar() {
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
    const [authToken, setAuthToken] = useAtom(authTokenAtom);

    // ログアウト処理
    const handleLogout = async () => {
        try {
            // サーバーサイドのログアウト処理
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}` // トークンを送信
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // クライアントサイドのクリーンアップ
            // localStorage/sessionStorageのクリア（もし使用している場合）
            deleteAuthToken();

            // Atomのリセット
            setIsLogedIn(false);
            setAuthToken("");
            setUserName("");

            // next/routerを使用したリダイレクト
            window.location.href = "/";  // または認証が必要なページからログインページへ
        } catch (error) {
            console.error('Logout failed:', error);
            // エラー処理（必要に応じてユーザーに通知）
        }
    };

    return (
        <div className="w-full relative">
            <Disclosure as="nav" className="relative rounded-md border-none">
                <div className="md:w-full dark:bg-gray-800 px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                        {/* ロゴとナビゲーション */}
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                                <img
                                    alt="PochiNote Logo"
                                    src="/Logo.svg"
                                    className="h-10 w-10"
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="text-black-100 hover:bg-white/5 hover:text-gray-400 rounded-md px-3 py-2 text-sm font-medium"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-left pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                            <div
                                className="flex items-center justify-between block w-full text-center px-2 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-indigo-400 rounded-md h-10 w-20"
                            >
                                <a
                                    href="/signup"
                                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white">
                                    Try for free
                                </a>
                                <ChevronsRight color="white" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="text-black-100 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
}
