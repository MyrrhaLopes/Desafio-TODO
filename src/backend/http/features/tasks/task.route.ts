import { Router } from "express";
import { tasksQuerySchemaType, taskByIdSchema, tasksQuerySchema } from "./task.schema";
import z from "zod";
export const taskRouter = Router();

taskRouter.get("/tasks/",(req,res)=>{
    const query = tasksQuerySchema.safeParse(req.query)

    if(!query.success){
      throw new Error('validation Error')
    }
    q
})
taskRouter.get("tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  task
});
