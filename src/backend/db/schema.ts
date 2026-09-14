import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const todoStatusEnum = pgEnum("todo_status", [
  "done",
  "to-do",
  "in-progress",
]);
export type TodoStatus = (typeof todoStatusEnum.enumValues)[number];
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const TasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  dueDateStart: timestamp("due_date_start"),
  dueDateEnd: timestamp("due_date_end"),
  status: todoStatusEnum("status").default("to-do"),
  createdAt: timestamp("create_at").defaultNow(),
  userId: serial("user_id").references(() => usersTable.id),
});
