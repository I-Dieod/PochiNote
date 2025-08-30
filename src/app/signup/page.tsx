// src/app/signup/page.tsx

import React from "react";

export default function SignupPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
				<h2 className="mb-6 text-center text-2xl font-bold text-blue-600">サインアップ</h2>
				<form className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
						<input type="email" id="email" name="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード</label>
						<input type="password" id="password" name="password" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
					</div>
					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード（確認）</label>
						<input type="password" id="confirmPassword" name="confirmPassword" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
					</div>
					<button type="submit" className="w-full rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600 transition">サインアップ</button>
				</form>
			</div>
		</div>
	);
}

