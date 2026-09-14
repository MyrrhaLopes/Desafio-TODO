import { db } from "../../../db/drizzle";
import { TasksTable, type TodoStatus } from "../../../db/schema";

export const tasksService = {
  queryTasks = async (query?:string,status?:TodoStatus)=>{
    const result = []
    if(query){
      result = db.select().from(TasksTable).where(query)
    }
    return result
  }
}
