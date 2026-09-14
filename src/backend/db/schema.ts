import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

const todoStatusEnum = pgEnum("todo_status", ["done", "to-do", "in-progress"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const todosTable = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  dueDateStart: timestamp("due_date_start"),
  dueDateEnd: timestamp("due_date_end"),
  status: todoStatusEnum("status").default("to-do"),
});
