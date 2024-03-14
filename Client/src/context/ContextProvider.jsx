import { createContext, useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
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
  const [userData, setUserData] = useState(null);

  const listen=useCallback(()=>{
    socket.on("notification", (data)=>{
      if(data.type==='handleRequest'){
        toast(
          <div>
            <Link to="/pendingPayments" className="text-blue-500 ">
              <p>
                <strong>{data.title}</strong>
              </p>
              <p>{data.description}</p>
            </Link>
          </div>,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    })
  },[socket]);
  const initialLoad = useCallback(async () => {
    const data = JSON.parse(localStorage.getItem("profile"));
    if (data) {
      const userId = data.userId;
      const token = data.accessToken;

      if (token && userId) {
        setUserData({ ...data });

        socket.emit("setup", userId);
        listen();
      } else {
        console.log("user Not autorized");
      }
    } else {
      console.error("An error occurred while authorizing:");
    }
  }, [socket,listen]);


  useEffect(() => {
    // Function to send a ping to the server

    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    initialLoad();
    return () => {
      // Disconnect the socket
      socket.disconnect();
    };
  }, [socket, initialLoad]);

 

  

  return (
    <AuthContext.Provider value={{ socket, userData ,initialLoad}}>
      {children}
    </AuthContext.Provider>
  );
};
