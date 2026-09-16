import z from "zod";
import { taskStatusEnum } from "../../../db/schema";

export const tasksQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  status: z.enum(taskStatusEnum.enumValues).optional(),
});
export type tasksQuerySchemaType = z.infer<typeof tasksQuerySchema>;
export const taskByIdSchema = z.object({
  id: z.uuid(),
});

export const postTaskBody = z.object({
  title: z.string().max(72),
  description: z.string().optional(),
  dueDateStart: z.date().optional(),
  dueDateEnd: z.date().optional(),
  status: z.enum(taskStatusEnum.enumValues),
});
export type PostTaskBody = z.infer<typeof postTaskBody>;

export const patchTaskBody = z.object({
  title: z.string().max(72).optional(),
  description: z.string().optional(),
  dueDateStart: z.coerce.date().optional().nullable(),
  dueDateEnd: z.coerce.date().optional().nullable(),
  status: z.enum(taskStatusEnum.enumValues).optional(),
});
export type PatchTaskBody = z.infer<typeof patchTaskBody>;
