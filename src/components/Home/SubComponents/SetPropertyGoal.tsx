// src/components/Home/SubComponents/SetPropertyGoal.tsx

import { useState } from "react";
import { useAtom } from "jotai";

import { Goals } from "@/types/index";
import { showSetGoalFormAtom } from "@/atoms/Settings.atom";
import { UserNameAtom, MailAtom, authTokenAtom } from "@/atoms/auth/auth.atom";

interface Step {
  id: number;
  name: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, name: "目標設定", description: "目標資産額の入力" },
  { id: 2, name: "モチベーション", description: "意気込み・スローガン" },
  { id: 3, name: "注意事項", description: "気をつけたいこと" },
];

export default function GoalSettingForm({
  action,
  onSubmit,
  onSuccess,
  onError,
  onClose,
}: {
  action: string;
  onSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (data: any) => void;
  onError: (data: any) => void;
  onClose: () => void;
}) {
  const [userName] = useAtom(UserNameAtom);
  const [email] = useAtom(MailAtom);
  const [authToken] = useAtom(authTokenAtom);

  const [stepFlag, setStepFlag] = useState<number>(1);

  const [showSetGoalForm, setShowSetGoalForm] = useAtom(showSetGoalFormAtom);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Goals>({
    propertyGoal: "",
    goalDeadline: new Date().toISOString().split("T")[0],
    goalMotivation: "",
    goalNote: "",
    monthlyGoal: "",
    monthlyGoalDeadline: new Date().toISOString().split("T")[0],
  });

  // モーダル外クリックで閉じる
  // TODO: モーダル外クリックで簡単に閉じたら書いてるもの間違って消える可能性を考慮する
  const handleBGClick = () => {
    setShowSetGoalForm(false);
  };
  const handleClickForm = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: フォームのバリデーションとデータの保存処理を実装する
    console.log("Send request to set goal for", {
      userName,
      email,
      authToken,
    });
    setError("");
    onSubmit(true);

    try {
      const requestBody = {
        userName: userName,
        goalData: {
          propertyGoal: formData.propertyGoal,
          goalDeadline: formData.goalDeadline,
          goalMotivation: formData.goalMotivation,
          goalNote: formData.goalNote,
          monthlyGoal: formData.monthlyGoal,
          monthlyGoalDeadline: formData.monthlyGoalDeadline,
        },
      };
      console.log("Send request for", requestBody);

      const setGoalResponse = await fetch(action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!setGoalResponse.ok) {
        throw new Error("目標の設定に失敗しました");
      }

      const result = await setGoalResponse.json();
      const newGoal = {
        ...result,
      };
      onSuccess(newGoal);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "エラーが発生しました";
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  // TODO: レイアウトを整える
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-opacity-50"
        onClick={handleBGClick}
      >
        <div
          id="Form"
          className="relative bg-white rounded-lg shadow-xl dark:bg-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={handleClickForm}
        >
          <div id="Main-Container" className="p-6">
            {/* ヘッダー */}
            <div id="Title-Container" className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {steps.find((step) => step.id === stepFlag)?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {steps.find((step) => step.id === stepFlag)?.description}
              </p>
            </div>

            <div
              id="Flex-Container"
              className="flex flex-col lg:flex-row gap-6"
            >
              {/* プログレスバー */}
              <div
                id="ProgressBar-Container"
                className="lg:w-1/3 lg:border-r-2 lg:border-gray-200 lg:pr-6"
              >
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div
                        className={`flex items-center justify-center h-8 w-8 rounded-full font-mono text-sm font-bold ${
                          stepFlag >= step.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.id}
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            stepFlag >= step.id
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* プログレスバー */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stepFlag / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* コンテンツエリア */}
              <div
                id="Content-Container"
                className="lg:w-2/3 bg-gray-50 dark:bg-gray-600 rounded-lg p-6"
              >
                {stepFlag === 1 && (
                  <div id="Step1-Content" className="space-y-4 flex-col">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        目標資産額（円）
                      </label>
                      <input
                        type="number"
                        placeholder="例: 1000000"
                        value={formData.propertyGoal}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            propertyGoal: e.target.value,
                          })
                        }
                        className="w-full h-17 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div id="GoalDeadline">
                      <label>目標達成までの期限</label>
                      <input
                        type="date"
                        value={formData.goalDeadline}
                        required
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            goalDeadline: e.target.value,
                          })
                        }
                        className="w-full h-17 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div id="MonthlyGoal">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        月間目標
                      </label>
                      <input
                        type="number"
                        placeholder="オプション"
                        value={formData.monthlyGoal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monthlyGoal: e.target.value,
                          })
                        }
                        className="w-full h-17 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div id="MonthlyGoalDeadline">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        月間目標達成期限
                      </label>
                      <input
                        type="date"
                        value={formData.monthlyGoalDeadline}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monthlyGoalDeadline: e.target.value,
                          })
                        }
                        className="w-full h-17 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={onClose}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => setStepFlag(2)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}

                {stepFlag === 2 && (
                  <div id="Step2-Content" className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      モチベーション・スローガン
                    </label>
                    <textarea
                      required
                      value={formData.goalMotivation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goalMotivation: e.target.value,
                        })
                      }
                      placeholder="例: 毎月コツコツ貯金して夢のマイホームを購入する！"
                      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStepFlag(1)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        戻る
                      </button>
                      <button
                        onClick={() => setStepFlag(3)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        次へ
                      </button>
                    </div>
                  </div>
                )}

                {stepFlag === 3 && (
                  <div id="Step3-Content" className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      気をつけたいこと
                    </label>
                    <textarea
                      required
                      value={formData.goalNote}
                      onChange={(e) =>
                        setFormData({ ...formData, goalNote: e.target.value })
                      }
                      placeholder="例: 無駄遣いを控え、家計簿をしっかりつける"
                      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStepFlag(2)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        戻る
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
