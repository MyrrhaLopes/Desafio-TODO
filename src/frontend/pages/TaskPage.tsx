import { createRoute } from "@tanstack/react-router"
import z, { uuid } from "zod"
import { rootRoute } from "../rootRoute"

const TaskPageQueryParamsSchema = z.object({
  id: uuid(),
})

export const TaskPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks/$taskId",
  validateSearch: TaskPageQueryParamsSchema
})

const TaskPage = () => {
  return <></>
}
