// src/lib/models/settingModel.ts

import { eq } from "drizzle-orm";

import { db } from "@/lib/config/db/db";
import { usersProperties } from "@/lib/config/db/schema/users";
import { Goals } from "@/types/index";

export const setGoal = async (userName: string, goalData: Goals) => {
  try {
    const goalDeadlineDate = new Date(goalData.goalDeadline);
    const monthlyGoalDeadlineDate = goalData.monthlyGoalDeadline
      ? new Date(goalData.monthlyGoalDeadline)
      : null;
    // Numeric型に対するバリデーション（空白だとErrorになるため）
    const monthlyGoal = goalData.monthlyGoal ? goalData.monthlyGoal : null;

    const result = await db
      .update(usersProperties)
      .set({
        propertyGoal: goalData.propertyGoal,
        goalDeadline: goalDeadlineDate,
        goalMotivation: goalData.goalMotivation,
        goalNote: goalData.goalNote,
        monthlyGoal: monthlyGoal,
        monthlyGoalDeadline: monthlyGoalDeadlineDate,
      })
      .where(eq(usersProperties.userName, userName))
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error in setGoal function:", error);
    throw new Error("Failed to set goal");
  }
};

export const getGoals = async (userName: string) => {
  try {
    const [result] = await db
      .select()
      .from(usersProperties)
      .where(eq(usersProperties.userName, userName));
    if (!result) {
      console.warn(`User with userName ${userName} not found`);
      return null;
    }

    return result;
  } catch (error) {
    console.error("Error in getGoal function:", error);
    throw new Error("Failed to get goal");
  }
};
