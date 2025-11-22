// src/atoms/BalanceChart.atom.tsx

import { atom } from "jotai";

import { Goals } from "@/types";

export const dropdownOpenAtom = atom(false);
export const dropdownMenuAtom = atom([
  { name: "Week", current: true },
  { name: "Month", current: false },
  { name: "Year", current: false },
  { name: "Max", current: false },
]);
export const selectedPeriodAtom = atom<"Week" | "Month" | "Year" | "Max">(
  "Week",
);

export const propertyGoalAtom = atom<number>();
export const goalsAtom = atom<Goals>();
