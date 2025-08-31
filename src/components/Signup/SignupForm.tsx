// src/components/Signup/SignupForm.tsx

import { useAtom } from "jotai";

import { AuthActionProps } from "@/types";
import { UserNameAtom, MailAtom, PasswordAtom, ConfirmPasswordAtom, ErrorMessageAtom } from "@/atoms/singup.atom";

export default function SignupForm({ action, onSubmit, onSuccess, onError }: AuthActionProps) {
    const [userName, setUserName] = useAtom(UserNameAtom);
    const [email, setEMail] = useAtom(MailAtom);
    const [password, setPassword] = useAtom(PasswordAtom);
    const [confirmPassword, setConfirmPassword] = useAtom(ConfirmPasswordAtom);
    const [errorMessage, setErrorMessage] = useAtom(ErrorMessageAtom);

    //  Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Send request for", {userName, email, password, confirmPassword});
        onSubmit(true);
        try {
            const response = await fetch(action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, password }),
            });

            if (!response.ok) {
                // エラー処理
                throw new Error("Request failed");
            }

            if (onSuccess) {
                const data = await response.json();
                onSuccess(data);
            } else {
                alert("Signup successful");
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
                if (onError) onError(error);
            }
            onSubmit(false);
        }
    };

    // Handle Reset Form
    const handleReset = () => {
        setEMail("");
        setPassword("");
        setConfirmPassword("");
        onSubmit(false);
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">ユーザー名</label>
                <input type="userName"
                    id="userName"
                    name="userName"
                    value={userName}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input type="email"
                    id="email"
                    name="email"
                    value={email}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setEMail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
                <input type="password"
                    id="password"
                    name="password"
                    value={password}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
                <input type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="buttonGroup">
                <button type="submit"
                    className="w-full rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600 transition"
                    disabled={!userName || !email || !password || password !== confirmPassword}
                >
                    サインアップ
                </button>
                <button type="button"
                    className="w-full rounded-md bg-gray-500 py-2 text-white font-semibold hover:bg-gray-600 transition"
                    onClick={handleReset}
                >
                    リセット
                </button>
            </div>
        </form>
    );
}