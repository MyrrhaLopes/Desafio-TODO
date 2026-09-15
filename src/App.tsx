import { RouterProvider } from "@tanstack/react-router";
import { router } from "./frontend/router";
import useAuth from "./frontend/hooks/useAuth";

export default function App() {
  const { data: user, isLoading } = useAuth();

  return (
    <RouterProvider router={router} context={{ auth: { user: user ?? null, isLoading } }} />
  );
}
