import BalanceChart from "@/components/BalanceChart";
import CircleChart from "@/components/CircleChart";
import NavBar from "@/components/NavBar";
import NoteTable from "@/components/NoteTable";
import Image from "next/image";

export default function Home() {
  return (
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
  );
}
