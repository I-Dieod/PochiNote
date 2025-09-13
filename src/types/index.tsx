// src/types/index.tsx

export interface BalanceDataType {
    date: string;
    balance: number;
}

export type AuthActionProps = {
    action: "/api/auth/signup" | "/api/auth/login";
    onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
}

export type DataActionProps = {
    action: "/api/data/add" | "/api/data/fetch";
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