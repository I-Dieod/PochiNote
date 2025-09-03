// src/app/page.tsx

"use client";

import { isLogedInAtom } from "@/atoms/auth/login.atom";
import { BalanceChart } from "@/components/Home/BalanceChart";
import { CircleChart } from "@/components/Home/CircleChart";
import NavBar from "@/components/Home/NavBar";
import NoteTable from "@/components/Home/NoteTable";
import { useAtom } from "jotai";

export default function Home() {
  const [isLogedIn, setIsLogedIn] = useAtom(isLogedInAtom);
  setIsLogedIn(true);
  return (
    <>
      {isLogedIn ? (
        <div id="Screen" className="gap-4 min-h-screen items-center justify-center">
          <div id="NavBar-Container">
            <NavBar />
          </div>
          <div id="Chart-Containers" className="flex flex-col md:flex-row md:h-1/4 gap-4 p-4 dark:bg-gray-900">
            <BalanceChart />
            <CircleChart />
          </div>
          <div id="Table-Container" className="w-full p-4">
            <h1>Table</h1>
            <NoteTable />
          </ div>
        </div>
      ) : (
        <div className="min-h-screen w-full bg-[#f9fafb] relative">
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
        </div>
      )
      }
    </>
  );
}
