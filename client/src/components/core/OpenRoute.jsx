import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { Loading } from "./Loading";

export const OpenRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <Loading />
        </div>
      );
    }
  if (isSignedIn) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};
