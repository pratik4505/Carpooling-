import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
export const AuthContext = createContext();
const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
export const ContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(
    io(baseUrl.replace("http", "ws"), {
      transports: ["websocket"],
      upgrade: false,
      withCredentials: true,
      pingInterval: 1000 * 60,
      pingTimeout: 1000 * 60 * 3,
    })
  );

  useEffect(() => {
    // Function to send a ping to the server

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return () => {
      // Disconnect the socket
      socket.disconnect();
    };
  }, [socket]);

  return (
    <AuthContext.Provider value={{ socket }}>{children}</AuthContext.Provider>
  );
};
