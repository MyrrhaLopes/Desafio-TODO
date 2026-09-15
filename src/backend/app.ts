import express from "express";
import { errorHandler } from "./http/middleware/errorHandler.middleware";
import { taskRouter } from "./http/features/tasks/task.route";

const app = express();

app.use(express.json()); //parseia a sequência de bytes como json em toda requisição

app.use('api/v1/',taskRouter);

// error handler global vai no final, depois de todas as rotas
app.use(errorHandler);

export default app;
