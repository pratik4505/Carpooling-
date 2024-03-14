import  { useEffect, useState, useContext } from "react";
import ChatList from "./ChatList";
import MessageContainer from "./MessageContainer";


import { IoMdAddCircleOutline } from "react-icons/io";
import { ChatContext } from "../../context/ChatProvider";



export default function MainMessage() {
  const {chats}=useContext(ChatContext);
  
  const [currChat, setCurrChat] = useState(null);
  

  

  const currChatHandler = (data) => {
    setCurrChat(data);
  };

  useEffect(() => {
   
  }, []);

  return (
    <div className=" flex  w-full h-[90vh] ">
      

      <div
        className={`w-full shadow-2xl relative md:w-[35%]  h-full ${
          currChat ? "hidden" : "block"
        } md:block bg-white`}
      >
        <div className=" bg-primary-300 flex items-center h-[10%] justify-between px-[2%] ">
          <h1 className="text-3xl ml-2 font-bold text-[#ffffff]">Chats</h1>
        </div>
        <div className="flex flex-col overflow-y-auto ">
          {chats.map((chat) => (
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
