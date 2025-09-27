// src/components/Home/MobileNavBar.tsx

"use client";

import { Menu, ChevronsRight } from 'lucide-react';
import { useAtom } from "jotai";

import { showSelectorLoginOrSignupAtom } from '@/atoms/NavBar.atom';

export default function MobileNavBar() {
    const [showSelectorLoginOrSignup, setShowSelectorLoginOrSignup] = useAtom(showSelectorLoginOrSignupAtom);

    return (
        <div className="w-full relative sm:hidden py-4">
            {/* Mobile NavBar content goes here */}
            <div id="Container" className="flex items-center justify-between">
                <Menu className="size-6 ml-4" />
                <img
                    alt="PochiNote Logo"
                    src="/Logo.svg"
                    className="h-10 w-10"
                />
                <div className="flex-col items-center justify-center mr-4">
                    <div
                        id="Button-Container"
                        className="items-center justify-center flex bg-emerald-500 hover:bg-indigo-400 rounded-md h-9 w-9"
                        onClick={() => setShowSelectorLoginOrSignup(!showSelectorLoginOrSignup)}
                    >
                        <ChevronsRight className="size-7" color="white" />
                    </div>

                    {showSelectorLoginOrSignup &&
                        <div className="absolute top-12 right-0 mt-2 w-auto bg-white rounded-md shadow-lg z-20">
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
    );
}