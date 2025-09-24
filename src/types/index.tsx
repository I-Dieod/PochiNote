// src/types/index.tsx

export type user = {
    tableId: number;
    userName: string;
    email: string;
    password: string;
    registeredAt: Date;
}

export interface BalanceDataType {
    date: string;
    balance: number;
}

export type PieSectorData = {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    fill?: string;
    payload?: any;
    percent?: number;
    value?: number;
}

export type AuthActionProps = {
    action: "/api/auth/signup" | "/api/auth/login";
    onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
}

export type DataActionProps = {
    action: "/api/data/add" | "/api/data/fetch" | "/api/data/update/transactionData";
    target: Transaction | null;
    onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    onClose: () => void;
}

export interface Category {
    categoryId: number;  // string から number に変更
    categoryName: string;
    categoryType: 'income' | 'expense';
    description?: string;
}

export interface Transaction {
    transactionId: number;
    transactionType: "income" | "expense";
    amount: string;
    categoryId: number;
    description?: string;
    transactionDate: string;
}