import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import { OpenRoute } from "./components/core/OpenRoute.jsx";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/core/ProtectedRoute.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { DashboardSection } from "./components/Dasboard/DashboardSection.jsx";
import { Battle } from "./pages/Battle.jsx";
import { BattleSpace } from "./pages/BattleSpace.jsx";
import { Profile } from "./pages/Profile.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { useDispatch } from "react-redux";

import { getUserProfile } from "./services/operations/user";
import { setUser, setToken } from "./slices/authSlice";
import { Loading } from "./components/core/Loading.jsx";

function App() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // if user not signed in
        if (!isSignedIn && isLoaded) {
          setLoading(false);
          return;
        }

        // get clerk token
        const token = await getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        // store token
        dispatch(setToken(token));

        localStorage.setItem("token", token);

        // fetch user profile
        const response = await getUserProfile(token);
        const profileData = response.data;
        const enrichedUser = {
          ...profileData,
          playerId: profileData?._id,
        };

        console.log("User profile fetched:", enrichedUser);

        // store user in redux
        dispatch(setUser(enrichedUser));
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSignedIn, getToken, dispatch]);

  // loading screen
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <OpenRoute>
            <Home />
          </OpenRoute>
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardSection />} />

        <Route path="battle" element={<Battle />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/battlespace/:battleId"
        element={
          <ProtectedRoute>
            <BattleSpace />
          </ProtectedRoute>
        }
      />

      {/* Auth */}
      <Route
        path="/auth/*"
        element={
          <OpenRoute>
            <Auth />
          </OpenRoute>
        }
      />
    </Routes>
  );
}

export default App;
