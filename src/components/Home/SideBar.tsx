// src/components/Home/SideBar.tsx

"use client";

export default function SideBar() {
    return (
        <>
            <div id="Main-Container" className="hidden h-full lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div id="header" className="flex justify-items-start h-16 px-4 pt-2 bg-white dark:bg-gray-900">
                    <img src="/Logo.svg" alt="Logo" className="h-10 w-10 mx-2 my-2" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white my-3">PochiNote</h2>
                </div>
                <div id="Menu-box" className="flex flex-col gap-2 m-2">
                    <div id="Dashboard" className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <a href="/">Dashboard</a>
                    </div>
                    <div id="Manage-Report" className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        Manage Report
                    </div>
                    <div id="Analytics" className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        Analytics
                    </div>
                    <div id="Settings" className="m-2 p-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        Settings
                    </div>
                </div>
                <div id="Footer" className="mt-auto p-4">
                    <p className="text-sm text-gray-500">© 2024 PochiNote</p>
                </div>
            </div>
        </>
    );
}