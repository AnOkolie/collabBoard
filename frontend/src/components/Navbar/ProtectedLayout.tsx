import { Navigate, Outlet, useLoaderData } from "react-router-dom";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { Navbar } from "./Navbar";
import { SocketProvider } from "../../context/SocketContext";

export const ProtectedLayout = () => {
  const loaderUser = useLoaderData();
  const authUser = useAuthStore((s) => s.authUser);

  const user = authUser ?? loaderUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <SocketProvider>
        <Navbar />
      </SocketProvider>
    </>
  );
};
