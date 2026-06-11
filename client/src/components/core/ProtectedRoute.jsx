import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { Loading } from "./Loading";

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for auth to load - show nothing or a loader
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }
    

  if (isSignedIn) {
    return children;
  }

  return <Navigate to="/auth" />;
};
