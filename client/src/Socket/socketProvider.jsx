import { createContext, useContext, useEffect } from "react";

import { socket } from "./socket";
import { useAuth } from "@clerk/react";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const connectSocket = async () => {
      console.log("SocketProvider: isSignedIn ->", isSignedIn);

      if (!isSignedIn) return;

      const token = await getToken();
      console.log("Token obtained for socket connection:", token);

      socket.auth = {
        token,
      };

      console.log("Attempting socket.connect() with auth token");
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket Connected", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connect_error:", err.message || err);
      });
    };

    connectSocket();

    return () => {
      socket.off("connect");
      socket.off("connect_error");

      socket.disconnect();
    };
  }, [isSignedIn]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
