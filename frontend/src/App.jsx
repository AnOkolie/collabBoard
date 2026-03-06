import { useEffect } from "react";
import "./App.css";
import "@mantine/core/styles.css";
import { Navbar } from "./components/Navbar/Navbar";
import { MantineProvider } from "@mantine/core";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { BoardPage } from "./components/Boards/BoardPage";
import { ColumnView } from "./components/Columns/ColumnView";
import { Login } from "./components/Login/Login";
import { boardLoader } from "./components/Boards/loader";
import { useAuthStore } from "./zustand/authStore/useAuthStore";
import { loginAction } from "./components/Login/action";
import { Signup } from "./components/Signup/Signup";
import { signupAction } from "./components/Signup/action";
import { PageLoader } from "./components/PageLoader/PageLoader";
import { columnLoader } from "./components/Columns/loader";
import { columnAction } from "./components/Columns/action";
import { DndContext } from "@dnd-kit/core";
import { boardAction } from "./components/Boards/action";
export const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (hasHydrated) checkAuth();
  }, [hasHydrated, checkAuth]);

  const RedirectIfAuthenticated = ({ children }) => {
    if (authUser) {
      return <Navigate to="/" />;
    }
    return children;
  };
  if (isCheckingAuth) return <PageLoader />;
  const router = createBrowserRouter([
    {
      children: [
        {
          path: "/",
          element: <BoardPage />,
          loader: boardLoader,
          action: boardAction,
        },
        {
          path: "/board/:board_id",
          element: (
            <DndContext>
              <ColumnView />
            </DndContext>
          ),
          loader: columnLoader,
          action: columnAction,
        },
        {
          path: "/login",
          element: (
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          ),
          action: loginAction,
        },
        {
          path: "/signup",
          element: (
            <RedirectIfAuthenticated>
              <Signup />
            </RedirectIfAuthenticated>
          ),
          action: signupAction,
        },
      ],
    },
  ]);
  return (
    <MantineProvider>
      <Navbar />
      <RouterProvider router={router} />
    </MantineProvider>
  );
};
