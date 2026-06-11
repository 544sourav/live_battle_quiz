
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import SocketProvider from "./Socket/socketProvider";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer/index.js";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
});
export function AppWithClerk() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <SocketProvider>
        <App />
      </SocketProvider>
    </ClerkProvider>
  );
}
createRoot(document.getElementById("root")).render(
  
    <Provider store={store}>
    <BrowserRouter>
      <AppWithClerk />
    </BrowserRouter>
    </Provider>
  
);
