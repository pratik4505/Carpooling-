import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { getChats, createChat } from "../Api/chatApi";
import { AuthContext } from "./ContextProvider";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const { userData, socket } = useContext(AuthContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChats();
        if (!res.error) {
          setChats(res.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    
    fetchChats();
  }, []);

  const chatAdder = async (rideId) => {
    try {
      const response = await createChat({ userData, rideId });

      if (response.data) {
        const data = response.data;
        socket.emit("joinChat", {
          rideId: data.rideId,
        });
        setChats((prevChats) => [data, ...prevChats]); // Put the new chat data in front of the chats array
      } else {
        console.error("Failed to add chat");
      }
    } catch (error) {
      console.error("An error occurred while adding chat:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ chats, setChats, chatAdder }}>
      {children}
    </ChatContext.Provider>
  );
};
