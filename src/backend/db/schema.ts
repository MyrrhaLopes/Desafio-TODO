import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

// Enum PostgreSQL que restringe os valores válidos de status de uma tarefa.
// Declarado no nível do banco para garantir integridade sem checagem no app.
export const taskStatusEnum = pgEnum("todo_status", [
  "done",
  "to-do",
  "in-progress",
]);
export type TodoStatus = (typeof taskStatusEnum.enumValues)[number];

// Tabela de usuários. A senha nunca é armazenada em texto puro —
// apenas o hash bcrypt (campo password_hash).
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),           // PK auto-incremental (integer)
  email: text("email").notNull().unique(), // unicidade garantida pelo banco
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
export type UserInsert = typeof usersTable.$inferSelect;

// Tabela de sessões HTTP. Cada login cria uma linha aqui; o id UUID
// é enviado ao browser via cookie httpOnly e serve como token de sessão.
// onDelete: "cascade" garante que ao deletar o usuário as sessões somem junto.
export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(), // token de sessão enviado no cookie
  userId: integer("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  // Expiração calculada pelo banco no momento do INSERT (7 dias a partir da criação).
  expiresAt: timestamp("expires_at")
    .notNull()
    .default(sql`now() + interval '7 days'`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tabela de tarefas. Cada tarefa pertence a um único usuário (userId).
// O intervalo de prazo é opcional e composto por dois timestamps (início e fim).
export const TasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  dueDateStart: timestamp("due_date_start"), // início do prazo (opcional)
  dueDateEnd: timestamp("due_date_end"),     // fim do prazo (opcional)
  status: taskStatusEnum("status").default("to-do"),
  createdAt: timestamp("create_at").defaultNow(),
  // onDelete: "cascade" remove as tarefas ao deletar o usuário dono
  userId: serial("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
});
export type TasksInsert = typeof TasksTable.$inferInsert;
export type TasksSelect = typeof TasksTable.$inferSelect;
