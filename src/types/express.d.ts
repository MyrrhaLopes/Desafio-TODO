import type { usersTable } from "../backend/db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: typeof usersTable.$inferSelect;
    }
  }
}

export type {};
