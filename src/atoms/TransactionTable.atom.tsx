// src/atoms/TransactionTable.atom.tsx

import { atom } from "jotai";

import { Category, Transaction } from "@/types/index"

export const showAddFormAtom = atom<boolean>(false);
export const transactionsAtom = atom<Transaction[]>([]);

export const categoriesAtom = atom<{
    income: Category[];
    expense: Category[];
}>({
    income: [],
    expense: []
});