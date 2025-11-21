// src/app/settings/page.tsx

"use client";

import { useState } from "react";
import { useAtom } from "jotai";

import { showSetGoalFormAtom } from "@/atoms/Settings.atom";
import SideBar from "@/components/Home/SideBar";
import SetPropertyGoal from "@/components/Home/SubComponents/SetPropertyGoal";

function PropertySetting() {
  const [showSetGoalForm, setShowSetGoalForm] = useAtom(showSetGoalFormAtom);

  return (
    <div className="flex flex-col ml-4 justify-center grid-4">
      <h1>Property Setting</h1>
      <div
        id="Update-Current-Property"
        className="w-sm rounded-md my-2 p-4 border-2 border-teal-200 hover:bg-teal-300"
      >
        Test
      </div>
      <div
        id="Set-Property-Goal"
        className="w-sm rounded-md my-2 p-4 border-2 border-teal-200 hover:bg-teal-300"
        onClick={() => setShowSetGoalForm(true)}
      >
        Set Property Goal
      </div>
    </div>
  );
}
export default function SettingsPage() {
  const [showSetGoalForm, setShowSetGoalForm] = useAtom(showSetGoalFormAtom);

  // 状態管理
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <div
        id="Screen-Container"
        className="flex w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300"
      >
        <div id="SideBar-Container">
          <SideBar />
        </div>
        <div
          id="Settings-Container"
          className="w-full h-full ml-70 m-8 p-4 bg-white rounded-md shadow-md divide-y-3 divide-gray-400"
        >
          <h1>Settings</h1>
          <PropertySetting />
        </div>
      </div>
      {showSetGoalForm && (
        <SetPropertyGoal
          action="/api/settings/setGoal"
          onSubmit={setSubmitted}
          onSuccess={(newGoal) => {
            console.log("New goal set:", newGoal);
            setShowSetGoalForm(false);
          }}
          onError={(error) => {
            console.error("Error setting goal:", error);
          }}
          onClose={() => setShowSetGoalForm(false)}
        />
      )}
    </>
  );
}
