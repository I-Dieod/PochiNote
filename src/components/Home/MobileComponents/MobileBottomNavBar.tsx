import React, { useState } from 'react';
import { LayoutDashboard, NotebookPen, Leaf, ChartPie, Bolt } from 'lucide-react';

export default function MobileBottomNavBar() {
    const [activeTab, setActiveTab] = useState('home'); // デフォルトでHomeをアクティブに

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, href: '/' },
        { id: 'manage', icon: NotebookPen, href: '/' },
        { id: 'home', icon: Leaf, href: '/' },
        { id: 'history', icon: ChartPie, href: '/PieChart' },
        { id: 'settings', icon: Bolt, href: '/' }
    ];

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 px-4 py-2">
                <div className="flex justify-between items-center relative">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isCenter = index === 2; // Homeアイコン（中央）

                        return (
                            <div key={item.id} className="relative flex flex-col items-center">
                                <a href={item.href}>
                                    {/* メインのナビゲーションボタン */}
                                    <button
                                        onClick={() => setActiveTab(item.id)}
                                        className={`
                                        relative z-10 flex items-center justify-center transition-all duration-300 ease-out
                                        ${isCenter
                                                ? 'w-14 h-14 rounded-2xl bg-emerald-500 shadow-lg hover:bg-emerald-600 transform hover:scale-105'
                                                : 'w-10 h-10 rounded-xl hover:bg-gray-100'
                                            }
                                        ${isActive && !isCenter ? 'bg-emerald-50' : ''}
                                    `}
                                    >
                                        <Icon
                                            size={isCenter ? 24 : 20}
                                            className={`
                                            transition-colors duration-200
                                            ${isCenter
                                                    ? 'text-white'
                                                    : isActive
                                                        ? 'text-emerald-500'
                                                        : 'text-gray-500'
                                                }
                                        `}
                                        />
                                    </button>
                                </a>

                                {/* アクティブインジケーター（中央以外） */}
                                {isActive && !isCenter && (
                                    <div className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}

                                {/* 中央アイコンの場合の特別なインジケーター */}
                                {isCenter && isActive && (
                                    <div className="absolute -bottom-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 追加のスタイリング - グラデーション効果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-3xl pointer-events-none" />
        </div>
    );
}