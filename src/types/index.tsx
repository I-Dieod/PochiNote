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