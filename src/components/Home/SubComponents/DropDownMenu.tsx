// src/components/Home/SubComponents/DropDownMenu.tsx

"use client";

import { useAtom } from "jotai";

import { dropdownMenuAtom, dropdownOpenAtom, selectedPeriodAtom } from "@/atoms/BalanceChart.atom";

export const DropdownMenu = () => {
    const [dropdownOpen, setDropdownOpen] = useAtom(dropdownOpenAtom);
    const [dropdownMenuItems] = useAtom(dropdownMenuAtom);
    const [selectedPeriod, setSelectedPeriod] = useAtom(selectedPeriodAtom);

    const handleClickButton = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    };

    return (
        <div
            id="dropdown-container"
            className="relative inline-block text-left"
            onClick={handleClickButton}
        >
            <button
                onClick={() => setDropdownOpen((open) => !open)}
                id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
                className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                {selectedPeriod}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
                <div id="dropdown" className="absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700" >
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {dropdownMenuItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                    aria-labelledby='dropdownDefaultButton'
                                    onClick={() => {
                                        if (item.name === 'Week') setSelectedPeriod('Week');
                                        else if (item.name === 'Month') setSelectedPeriod('Month');
                                        else if (item.name === 'Year') setSelectedPeriod('Year');
                                        else setSelectedPeriod('Max');
                                    }}
                                >
                                    {item.name}
                                </a>
                            </ li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};