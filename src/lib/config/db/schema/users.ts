// src/lib/config/db/schema/users.ts

//usersテーブルの定義
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  tableId: serial("table_id").notNull().primaryKey(),
  userName: varchar("user_name", { length: 100 }).notNull(), // ユーザー名
  email: varchar("email", { length: 255 }).notNull().unique(), // メールアドレス
  password: varchar("password", { length: 255 }).notNull(), // ハッシュ化されたパスワード
  registeredAt: timestamp("registered_at").defaultNow().notNull(), // 登録日時
});

export const usersProperties = pgTable("users_properties", {
  userName: varchar("user_name", { length: 100 }).notNull(),
  // 資産情報
  // 現在の資産
  currentProperty: numeric("current_property", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),

  // 資産目標
  propertyGoal: numeric("property_goal", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  // 目標期限
  goalDeadline: timestamp("goal_deadline").notNull(), // 目標達成期限
  // モチベーション
  goalMotivation: varchar("goal_motivation", { length: 255 }).notNull(),
  // 注意事項
  goalNote: varchar("goal_note", { length: 255 }).notNull(),

  // 月次目標（オプション）
  monthlyGoal: numeric("monthly_goal", { precision: 12, scale: 2 }).default(
    "0",
  ), // 月次貯蓄目標
  monthlyGoalDeadline: timestamp("monthly_goal_deadline"), // 月次貯蓄目標達成期限

  // 資産の内訳（オプション - より詳細な管理が必要な場合）
  cashAmount: numeric("cash_amount", { precision: 12, scale: 2 }).default("0"), // 現金・預金
  investmentAmount: numeric("investment_amount", {
    precision: 12,
    scale: 2,
  }).default("0"), // 投資資産
  otherAssets: numeric("other_assets", { precision: 12, scale: 2 }).default(
    "0",
  ), // その他資産

  lastUpdated: timestamp("last_updated").defaultNow().notNull(), // 最終更新日時
  createdAt: timestamp("created_at").defaultNow().notNull(), // 作成日時
});
