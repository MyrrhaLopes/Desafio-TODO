import express from "express";
import { errorHandler } from "./http/middleware/errorHandler.middleware";
import { taskRouter } from "./http/features/tasks/task.route";
import { userRouter } from "./http/features/users/user.route";

const app = express();

app.use(express.json()); //parseia a sequência de bytes como json em toda requisição

app.use('api/v1/',taskRouter);
app.use('api/v1/',userRouter)
// error handler global vai no final, depois de todas as rotas
app.use(errorHandler);

export default app;
