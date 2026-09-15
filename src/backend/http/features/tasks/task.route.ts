import { Router } from "express";
import { taskByIdSchema, tasksQuerySchema } from "./task.schema";
import { TASK_SERVICE } from "./task.service";

export const taskRouter = Router();

taskRouter.get("/tasks/", async (req, res, next) => {
  try {
    const { status, search } = tasksQuerySchema.parse(req.query);
    const result = await TASK_SERVICE.queryTasks(search, status);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

taskRouter.get("/tasks/:id", async (req, res, next) => {
  try {
    const { id } = taskByIdSchema.parse(req.params);
    const result = await TASK_SERVICE.queryById(id);
    if (result.length == 0) {
      return res.status(404).json({ message: "task not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

taskRouter.post("/tasks/", async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});
