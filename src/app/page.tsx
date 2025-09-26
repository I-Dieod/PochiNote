// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import SideBar from "@/components/Home/SideBar";
import NavBar from "@/components/Home/NavBar";
import { BalanceChart } from "@/components/Home/BalanceChart";
import { CircleChart } from "@/components/Home/CircleChart";
import TransactionTable from "@/components/Home/TransactionTable";

import { isLogedInAtom } from "@/atoms/auth/auth.atom";
import { dropdownOpenAtom } from "@/atoms/BalanceChart.atom";
import { showSelectorLoginOrSignupAtom } from "@/atoms/NavBar.atom";

export default function Home() {
    const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
    const [dropdownOpen, setDropdownOpen] = useAtom(dropdownOpenAtom);

    const [showSelectorLoginOrSignup, setShowSelectorLoginOrSignup] = useAtom(showSelectorLoginOrSignupAtom);

    // デバッグ用ログ
    useEffect(() => {
        console.log("Page rendered with isLogedIn:", isLogedIn);
    }, [isLogedIn]);

    //setIsLogedIn(false); // release時に削除
    console.log("Home component rendering, isLogedIn:", isLogedIn);

    // モーダル外クリックで閉じる
    const handleDropdownBGClick = () => {
        setDropdownOpen(false);
    }
    const handleSelectorLoginOrSignupBGClick = () => {
        setShowSelectorLoginOrSignup(false);
    }

    return (
        <>
            {isLogedIn ? (
                <div
                    id="Screen"
                    className="gap-4 min-h-screen items-center justify-center"
                    onClick={handleDropdownBGClick}
                >
                    <div id="Main-container" className="flex">
                        <div id="SideBar-Container">
                            <SideBar />
                        </div>
                        <div id="Content-Container" className="flex-1 flex flex-col min-h-screen ml-64 bg-slate-100">
                            <div id="Chart-Containers" className="flex flex-col md:flex-row h-150 gap-4 p-4 dark:bg-gray-900">
                                <BalanceChart />
                                <CircleChart />
                            </div>
                            <div id="Table-Container" className="w-full p-4">
                                <TransactionTable />
                            </ div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="min-h-screen w-full bg-[#f9fafb] relative"
                >
                    {/* Diagonal Fade Grid Background - Top Left */}
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
        `,
                            backgroundSize: "32px 32px",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                            maskImage:
                                "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
                        }}
                    />
                    {/* Your Content/Components */}
                    <div id="NavBar-Container">
                        <NavBar />
                    </div>
                    {/* TODO:releaseブランチでは消す */}
                    <p style={{ color: 'red', fontSize: '20px', textAlign: 'center', marginTop: '50px' }}>
                        未ログイン状態の表示
                    </p>
                    <div
                        id="Main-Container"
                        className="flex flex-col items-center justify-top h-screen relative z-10 px-4"
                        onClick={handleSelectorLoginOrSignupBGClick}
                    >
                        <div id="catch-phrase" className="h-20 mb-4 flex items-center justify-center">
                            <h1 className="text-6xl md:text-5xl font-bold font-stretch-expanded tracking-wide text-shadow-lg/20 bg-linear-65 from-emerald-400 to-indigo-300 bg-clip-text text-transparent">
                                Be smart, Be steady.
                            </h1>
                        </div>
                        <div id="description-container" className="mb-8 w-full text-center text-gray-600 p-6">
                            <p className="text-lg md:text-xl ">
                                <strong>PochiNote</strong>は、あなたの資産管理をシンプルかつ効果的にサポートするためのモダンアプリケーションです。<br />
                                収支の可視化、目標設定、そして賢いお金の使い方を提案します。<br />
                            </p>
                        </div>
                        <div id="feature-cards" className="flex flex-col gap-6 mb-8 w-full max-w-6xl">
                            {/* Feature Card 1 */}
                            <div className="flex justify-between bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex-col">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">収支の可視化</h2>
                                    <p className="text-gray-600 text-xl">
                                        直感的なチャートとグラフで、あなたの収入と支出を一目で把握できます。<br />
                                        日々の取引を簡単に記録し、財務状況をリアルタイムで確認しましょう。
                                    </p>
                                </div>
                                <img
                                    src="/feature-visualization.png"
                                    alt="収支の可視化"
                                    className="h-48 mt-4 rounded-md shadow-sm"
                                />
                            </div>
                            {/* Feature Card 2 */}
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">目標設定と追跡</h2>
                                <p className="text-gray-600">
                                    貯蓄目標や支出制限を設定し、進捗を追跡します。<br />
                                    目標達成に向けたアドバイスとリマインダーで、モチベーションを維持しましょう。
                                </p>
                            </div>
                            {/* Feature Card 3 */}
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">賢いお金の使い方</h2>
                                <p className="text-gray-600">
                                    あなたの支出パターンを分析し、節約のヒントや投資の機会を提案します。<br />
                                    賢い財務管理で、将来の安心を手に入れましょう。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </>
    );
}
