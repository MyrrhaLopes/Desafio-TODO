import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/drizzle";
import { TasksTable, type TodoStatus } from "../../../db/schema";

export const TASK_SERVICE = {
  queryTasks: async (query?: string, status?: TodoStatus) => {
    return db
      .select()
      .from(TasksTable)
      .where(
        and(
          query
            ? or(
                ilike(TasksTable.title, `%${query}%`),
                ilike(TasksTable.description, `%${query}%`),
              )
            : undefined,
          status ? eq(TasksTable.status, status) : undefined,
        ),
      );
  },
  queryById: async (id: string) => {
    return db.select().from(TasksTable).where(eq(TasksTable.id, id));
  },
};
