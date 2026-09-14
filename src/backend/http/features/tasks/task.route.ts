import { Router } from "express";
import { tasksQuerySchemaType } from "./task.schema";
export const taskRouter = Router();

taskRouter.get("tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { search, status } = req.params as tasksQuerySchemaType;
});
