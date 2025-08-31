// src/app/signup/page.tsx

"use client";

import React from "react";
import { useState } from "react";

import SignupForm from "@/components/Signup/SignupForm";

export default function SignupPage() {
    const [submitted, setSubmitted] = useState(false);
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-blue-600">サインアップ</h2>
                <SignupForm
                    action="/api/auth/signup"
                    onSubmit={setSubmitted}
                    onSuccess={(response) => console.log("Signup successful:", response)}
                    onError={(error) => console.error("Signup error:", error)}
                />
            </div>
        </div>
    );
}

