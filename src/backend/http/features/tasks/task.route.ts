import { Router } from "express";
import { postTaskBody, taskByIdSchema, tasksQuerySchema } from "./task.schema";
import { TASK_SERVICE } from "./task.service";
import { authorizeUser } from "../../middleware/authorizeUser";

export const taskRouter = Router();

taskRouter.get("/tasks/", authorizeUser, async (req, res, next) => {
  try {
    const { status, search } = tasksQuerySchema.parse(req.query);
    const result = await TASK_SERVICE.queryTasks(req.user!.id, search, status);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

taskRouter.get("/tasks/:id", authorizeUser, async (req, res, next) => {
  try {
    const { id } = taskByIdSchema.parse(req.params);

    const result = await TASK_SERVICE.queryById(req.user!.id, id);
    if (result.length == 0) {
      return res.status(404).json({ message: "task not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

taskRouter.post("/tasks/", authorizeUser, async (req, res, next) => {
  try {
    const values = postTaskBody.parse(req.body);
    const userId = req.user!.id;
    const task = await TASK_SERVICE.postTask({ ...values, userId });
    return res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});
