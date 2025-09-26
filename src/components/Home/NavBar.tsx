// src/components/NavBar.tsx

"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAtom } from "jotai";
import { ChevronsRight } from 'lucide-react';

import { UserNameAtom, authTokenAtom, isLogedInAtom } from '@/atoms/auth/auth.atom';
import { showSelectorLoginOrSignupAtom } from '@/atoms/NavBar.atom';

const navigation = [
    { name: 'Dashboard', href: '#' },
    { name: 'Team', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Calendar', href: '#' },
]

export default function NavBar() {
    const [showSelectorLoginOrSignup, setShowSelectorLoginOrSignup] = useAtom(showSelectorLoginOrSignupAtom);

    return (
        <div className="w-full relative">
            <Disclosure as="nav" className="relative rounded-md border-none">
                <div className="md:w-full dark:bg-gray-800 px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
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

                        <div className="flex-col items-center justify-center">
                            <div className="absolute inset-y-0 right-0 flex items-left pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                <div
                                    className="flex items-center justify-between block w-full text-center px-2 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-indigo-400 rounded-md h-10 w-20"
                                    onClick={() => setShowSelectorLoginOrSignup(true)}

                                >
                                    <p
                                        className="block w-full text-center px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Try for free
                                    </p>
                                    <ChevronsRight color="white" size={32} />
                                </div>
                            </div>
                            {showSelectorLoginOrSignup &&
                                <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                    <a
                                        href="/login"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Log In
                                    </a>
                                    <a
                                        href="/signup"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Sign Up
                                    </a>
                                </div>
                            }
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
