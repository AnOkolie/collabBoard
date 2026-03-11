import { Navigate, Outlet, useLoaderData } from "react-router-dom";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { Navbar } from "./Navbar";
import { BoardSocketProvider } from "../../context/BoardSocketContext";

export const ProtectedLayout = () => {
  const loaderUser = useLoaderData();
  const authUser = useAuthStore((s) => s.authUser);

  const user = authUser ?? loaderUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <BoardSocketProvider>
        <Navbar />
      </BoardSocketProvider>
    </>
  );
};
