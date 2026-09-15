import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/drizzle";
import { TasksTable, type TodoStatus } from "../../../db/schema";

export const TASK_SERVICE = {
  queryTasks: async (userId: number,query?: string, status?: TodoStatus) => {
    return db
      .select()
      .from(TasksTable)
      .where(
          and(
            eq(TasksTable.userId,userId),
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
  queryById: async (userId:number,id: string) => {
    return db.select().from(TasksTable).where(and(eq(TasksTable.id, id),eq(TasksTable.userId,userId)));
  },
};
