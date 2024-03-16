import { useEffect, useState, useContext } from "react";
import ChatList from "./ChatList";
import MessageContainer from "./MessageContainer";

import { IoMdAddCircleOutline } from "react-icons/io";
import { ChatContext } from "../../context/ChatProvider";

export default function MainMessage() {
  const { chats } = useContext(ChatContext);
  const [currChat, setCurrChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currChatHandler = (data) => {
    setCurrChat(data);
  };

  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {}, []);

  return (
    <div className="flex pt-[70px] w-full h-[100vh] overflow-hidden ">
      <div
        className={`w-full shadow-2xl relative md:w-[35%] h-full ${
          currChat ? "hidden" : "block"
        } md:block bg-white`}
      >
        <div className="bg-primary-300 h-[10%] py-3 flex items-center justify-between px-[2%] ">
          <h1 className="text-3xl ml-2 font-bold text-[#ffffff]">Chats</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search chats..."
              className="px-3 py-1 mr-2 border rounded-md focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col h-[80vh] overflow-auto ">
          {filteredChats.map((chat) => (
            <ChatList
              key={chat._id}
              chat={chat}
              onChatClick={currChatHandler}
              currChat={currChat}
            />
          ))}
        </div>
      </div>
      {currChat && (
        <MessageContainer
          key={currChat._id}
          data={currChat}
          closeContainer={() => setCurrChat(null)}
        />
      )}
    </div>
  );
}
