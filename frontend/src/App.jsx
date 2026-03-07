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
import { UserProfile } from "./components/UserProfile/UserProfile";
import { userProfileAction } from "./components/UserProfile/action";
import { loginLoader } from "./components/Login/loader";
import { AppLayout } from "./components/Navbar/Navbar";
import { navbarAction } from "./components/Navbar/action";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
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
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorBoundary />,
      hydrateFallbackElement: <PageLoader />,
      children: [
        {
          index: true,
          element: <BoardPage />,
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          loader: boardLoader,
          action: boardAction,
        },
        {
          path: "board/:board_id",
          element: (
            <DndContext>
              <ColumnView />
            </DndContext>
          ),
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          loader: columnLoader,
          action: columnAction,
        },
        {
          path: "login",
          element: <Login />,
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          loader: loginLoader,
          action: loginAction,
        },
        {
          path: "signup",
          element: <Signup />,
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          action: signupAction,
        },
        {
          path: "profile",
          element: <UserProfile />,
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          action: userProfileAction,
        },
        {
          path: "logout",
          errorElement: <ErrorBoundary />,
          hydrateFallbackElement: <PageLoader />,
          action: navbarAction,
        },
      ],
    },
  ]);
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
};
