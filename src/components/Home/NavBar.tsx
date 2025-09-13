// src/components/NavBar.tsx

"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAtom } from "jotai";

import { DarkModeToggle } from '@/atoms/DarkMode.atom'
import { UserNameAtom, authTokenAtom, isLogedInAtom } from '@/atoms/auth/auth.atom';

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
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        setIsLogedIn(false);
        setAuthToken("");
        setUserName("");
        // ログインページにリダイレクト
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };

    return (
        <div className="w-full relative">
            {/* ログイン時のみ背景のグロー効果を表示 */}
            {isLogedIn && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(125% 125% at 50% 90%, #ffffff 50%, #14b8a6 100%)
                        `,
                        backgroundSize: "100% 100%",
                    }}
                />
            )}
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
                                    alt="Your Company"
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    className="h-8 w-auto"
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
                            <DarkModeToggle />
                            {/* Notification Button */}
                            {/* ログイン時のみ通知ボタンを表示 */}
                            {isLogedIn && (
                                <button
                                    type="button"
                                    className="relative rounded-full p-1 text-gray-600 hover:text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 transition-colors duration-200"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="size-6" />
                                </button>
                            )}

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                                    />
                                </MenuButton>
                                {isLogedIn ? (
                                    /* ログイン済みユーザーメニュー */
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                                    >
                                        <MenuItem>
                                            <a
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-gray-50"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-gray-50"
                                            >
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-gray-50"
                                            >
                                                Sign Out
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                ) : (
                                    /* 未ログインユーザーメニュー */
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                                    >
                                        <MenuItem>
                                            <a
                                                href="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-gray-50"
                                            >
                                                Sign In
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="/signup"
                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-gray-50"
                                            >
                                                Sign Up
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                )}
                            </Menu>
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
