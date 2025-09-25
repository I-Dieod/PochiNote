// src/lib/config/db/schema/users.ts

//usersテーブルの定義
import { pgTable, serial, varchar, timestamp, numeric, date } from "drizzle-orm/pg-core"

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
    currentProperty: numeric("current_property", { precision: 12, scale: 2 }).notNull().default("0"), // 現在の資産
    propertyGoal: numeric("property_goal", { precision: 12, scale: 2 }).notNull().default("0"), // 資産目標

    // 目標期限
    goalDeadline: date("goal_deadline"), // 目標達成期限

    // 月次目標（オプション）
    monthlyGoal: numeric("monthly_goal", { precision: 12, scale: 2 }).default("0"), // 月次貯蓄目標

    // 資産の内訳（オプション - より詳細な管理が必要な場合）
    cashAmount: numeric("cash_amount", { precision: 12, scale: 2 }).default("0"), // 現金・預金
    investmentAmount: numeric("investment_amount", { precision: 12, scale: 2 }).default("0"), // 投資資産
    otherAssets: numeric("other_assets", { precision: 12, scale: 2 }).default("0"), // その他資産

    lastUpdated: timestamp("last_updated").defaultNow().notNull(), // 最終更新日時
    createdAt: timestamp("created_at").defaultNow().notNull(), // 作成日時
});