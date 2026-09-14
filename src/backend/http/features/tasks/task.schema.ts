import z from "zod";
import { todoStatusEnum } from "../../../db/schema";

export const tasksQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  status: z.enum(todoStatusEnum.enumValues).optional(),
});
export type tasksQuerySchemaType = z.infer<typeof tasksQuerySchema>;
export const taskByIdSchema = z.object({
  id: z.uuid(),
});
