// src/atoms/BalanceChart.atom.tsx

import { atom, useAtom } from 'jotai';

export const dropdownOpenAtom = atom(false);
export const dropdownMenuAtom = atom([
    { name: 'Week', current: true },
    { name: 'Month', current: false },
    { name: 'Year', current: false },
    { name: 'Max', current: false },
]);
export const selectedPeriodAtom = atom<'Week' | 'Month' | 'Year' | 'Max'>('Week');