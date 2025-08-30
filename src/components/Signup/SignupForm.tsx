// src/components/Signup/SignupForm.tsx


import { useAtom } from "jotai";

import { MailAtom, PasswordAtom, ConfirmPasswordAtom } from "@/atoms/singup.atom";

type Props = {
    onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignupForm({ onSubmit }: Props) {
    const [mail, setMail] = useAtom(MailAtom);
    const [password, setPassword] = useAtom(PasswordAtom);
    const [confirmPassword, setConfirmPassword] = useAtom(ConfirmPasswordAtom);

    //  Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(mail, password, confirmPassword);
        onSubmit(true);
    };

    // Handle Reset Form
    const handleReset = () => {
        setMail("");
        setPassword("");
        setConfirmPassword("");
        onSubmit(false);
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input type="email"
                    id="email"
                    name="email"
                    value={mail}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    onChange={(e) => setMail(e.target.value)}
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
                    disabled={!mail || !password || password !== confirmPassword}
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