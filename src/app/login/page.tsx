// src/app/login/page.tsx

"use client";

import React from "react";
import { useState } from "react";

import LoginForm from "@/components/Login/LoginForm";

export default function LoginPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">ログイン</h2>
                <LoginForm
                    action="/api/auth/login"
                    onSubmit={setSubmitted}
                    onSuccess={(response) => console.log("Login successful:", response)}
                    onError={(error) => console.error("Login error:", error)}
                />
            </div>
        </div>
    );
}
