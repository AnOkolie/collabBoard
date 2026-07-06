import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { useAuthStore } from "./zustand/authStore/useAuthStore";
import { BoardPage } from "./components/Boards/BoardPage";
import { ColumnView } from "./components/Columns/ColumnView";
import { Login } from "./components/Login/Login";
import { Signup } from "./components/Signup/Signup";
import { UserProfile } from "./components/UserProfile/UserProfile";
import { ProtectedLayout } from "./components/Navbar/ProtectedLayout";
import { PageLoader } from "./components/PageLoader/PageLoader";
import { boardLoader } from "./components/Boards/loader";
import { boardAction } from "./components/Boards/action";
import { columnLoader } from "./components/Columns/loader";
import { columnAction } from "./components/Columns/action";
import { loginAction } from "./components/Login/action";
import { signupAction } from "./components/Signup/action";
import { userProfileAction } from "./components/UserProfile/action";
import { logoutAction } from "./components/Navbar/action";
import { authLoader } from "./components/Navbar/loader";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SearchUser } from "./components/SearchUser/SearchUser";
import { searchLoader } from "./components/SearchUser/loader";
import { searchAction } from "./components/SearchUser/action";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { SocketProvider } from "./context/SocketContext";
import { Message } from "./components/Messages/Message";
import { messagesLoader } from "./components/Messages/messagesLoader";
import { conversationLoader } from "./components/Messages/conversationLoader";
import { SocketListeners } from "./context/SocketListeners";
import { ChannelList } from "./components/Messages/ChannelList";
import { EmptyConversation } from "./components/Messages/EmptyConversation";
import { Friends } from "./components/Friends/Friends";
import { friendLoader } from "./components/Friends/loader";
import { groupMessagesLoader } from "./components/Messages/groupMessagesLoader";
import { CalendarPage } from "./components/Calendar/CalendarPage";
import { calendarLoader } from "./components/Calendar/loader";
import { Dashboard } from "./components/Dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    action: loginAction,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Signup />,
    action: signupAction,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/",
    loader: authLoader,
    action: logoutAction,
    element: <ProtectedLayout />,
    // errorElement: <ErrorBoundary />,
    shouldRevalidate: () => false,
    children: [
      {
        index: true,
        element: <BoardPage />,
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
        loader: columnLoader,
        action: columnAction,
      },
      {
        path: "profile",
        element: <UserProfile />,
        action: userProfileAction,
      },
      {
        path: "search",
        element: <SearchUser />,
        loader: searchLoader,
        action: searchAction,
      },
      {
        path: "activity/:id",
      },
      {
        path: "calendar",
        element: <CalendarPage />,
        loader: calendarLoader,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: boardLoader,
      },
      {
        path: "messages",
        element: <ChannelList />,
        loader: conversationLoader,
        children: [
          {
            index: true,
            element: <EmptyConversation />,
          },
          {
            path: ":boardId",
            element: <Message />,
            loader: groupMessagesLoader,
          },
          {
            path: ":userId/:conversationId",
            element: <Message />,
            loader: messagesLoader,
          },
        ],
      },
      {
        path: "friends",
        element: <Friends />,
        loader: friendLoader,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

export const App = () => {
  const isCheckingAuth = useAuthStore((s) => s.isCheckingAuth);

  if (isCheckingAuth) return <PageLoader />;
  return (
    <MantineProvider>
      <Notifications />
      <ModalsProvider>
        <SocketProvider>
          <SocketListeners />
          <RouterProvider router={router} />
        </SocketProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};
