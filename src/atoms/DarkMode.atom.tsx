// src/atoms/DarkMode.atom.tsx

"use client";

import { atom, useAtom } from 'jotai';

const darkModeAtom = atom(false);

export const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return next;
        });
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
};