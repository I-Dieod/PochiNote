// src/lib/config/db/schema/transaction.ts

import { pgEnum, pgTable, serial, varchar, text, timestamp, numeric, integer } from "drizzle-orm/pg-core"

export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense"])

// Category table
export const categories = pgTable("categories", {
    categoryId: serial("category_id").notNull().primaryKey(),
    categoryName: varchar("category_name", { length: 100 }).notNull(),
    categoryType: transactionTypeEnum("category_type").notNull(), // "income" or "exxpense"
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Main transaction table
export const transactions = pgTable("transactions", {
    transactionId: serial("transaction_id").notNull().primaryKey(),
    userName: varchar("user_name", { length: 100 }).notNull(),
    transactionType: transactionTypeEnum("transaction_type").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    categoryId: integer("category_id").references(() => categories.categoryId),
    description: text("description"),
    transactionDate: timestamp("transaction_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// Monthly Summary
export const monthlySummaries = pgTable("monthly_summaries", {
    summaryId: serial("summary_id").notNull().primaryKey(),
    userName: varchar("user_name", { length: 100 }).notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    totalIncome: numeric("total_income", { precision: 12, scale: 2 }).notNull().default("0"),
    totalExpense: numeric("total_expense", { precision: 12, scale: 2 }).notNull().default("0"),
    balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

// 予算テーブル（月次予算管理）
export const budgets = pgTable("budgets", {
    budgetId: serial("budget_id").notNull().primaryKey(),
    userName: varchar("user_name", { length: 100 }).notNull(),
    categoryId: integer("category_id").references(() => categories.categoryId),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    budgetAmount: numeric("budget_amount", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})