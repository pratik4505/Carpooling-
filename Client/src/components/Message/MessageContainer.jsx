import React, { useEffect, useState, useContext, useCallback } from "react";
import "./messageContainer.scss";
import { Link } from "react-router-dom";
import { getMessages,postMessage } from "../../Api/chatApi";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import { checkToxicity } from "../../Api/perspectiveApi";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";

import { AuthContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
const msgPerLoad = 50;

let myId;

export default function MessageContainer(props) {
  const [messages, setMessages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [currMsg, setCurrMsg] = useState("");

  const {userData,socket}=useContext(AuthContext);

  const messageLoader = async () => {
    try {
      const limit = msgPerLoad;
     
      const createdAt =
        messages.length > 0 ? messages[0].createdAt : new Date();

      const response = await getMessages(limit,props.data.rideId,createdAt);
        
        
     

      if (response.data) {
        const data = response.data
        
        // If the response is not empty, update the messages array
        if (data.length > 0) {
          setMessages((prevMessages) => [...data, ...prevMessages]);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("An error occurred while fetching messages:", error);
    }
  };

  

  useEffect(() => {
    
    myId = userData.userId;
    if(!myId)return;
    setMessages([]);
    messageLoader();
    socket.on("receiveMessage", (data) => {
      console.log("useEffect");
      if (data.senderId !== myId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              _id: uuidv4(),
              message: data.message,
              senderId: data.senderId,
              createdAt: data.createdAt,
              rideId: props.data.rideId,
            },
          ];
        });
      }
    });
  }, [props.data.chatId]);
  console.log(messages)
  const sendMsg = async () => {
    const _id = uuidv4();

    const msg = currMsg;
    if(checkToxicity(msg)){
      toast( <div>
        Warning :  This message may be toxic
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0.7,
      });
      return;
    }
    setMessages((prev) => {
      return [...prev, { _id: _id, senderId: myId, message: currMsg }];
    });
    setCurrMsg("");

    socket.emit("sendMessage", {
      room: props.data.rideId,
      message: msg,
      senderId: myId,
      createdAt: new Date(),
      userData: userData,
    });
    const data = {
      senderId: myId,
      rideId: props.data.rideId,
      message: msg,
    };

    try {
      const response = await postMessage(data);

      if (response.error) {
        console.error("Failed to save message to the server");
      }
    } catch (error) {
      console.error("An error occurred while posting the message:", error);
    }
  };

  return (
    <div className="  h-full w-full md:w-[70%] bg-white shadow-5xl">
      <div className="bg-primary-300 flex items-center h-[10%] justify-between px-[2%]  ">
        <div className="flex items-center justify-between">
        <IoIosArrowBack
          size={28}
          color="#ffff"
          onClick={() => props.closeContainer()}
        />
        
       
          <FaRegUser size={28} className="mx-2" />
        
        <h1 className="text-3xl ml-2 font-bold text-[#ffffff]">{props.data.chatName}</h1>
        </div>
        
        
      </div>
      <ScrollToBottom className="flex flex-col overflow-y-auto h-[80%] px-2">
        {loadMore && (
          <button
            onClick={messageLoader}
            className="btn btn-primary loadmore-messaging-section m-auto"
          >
            Load More
          </button>
        )}
         
        {messages&&messages.map((msg) => (
          <div
            className={`message ${
              msg.senderId === myId ? "outgoing" : "incoming"
            }`}
            key={msg._id}
          >
            <Link to={`/profile/${msg.senderId}`}>
                {props.data.members[msg.senderId]?.imageUrl && (
                  <img
                    src={props.data.members[msg.senderId]?.imageUrl }
                    alt="avatar"
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
                  {props.data.members[msg.senderId]?.name}
                </h3>
              </Link>
            {msg.message}
          </div>
        ))}
      </ScrollToBottom>
      <div className="flex w-full border-none  text-base outline-none bg-gray-100 h-[10%]">
        <textarea
          id="textarea"
          value={currMsg}
          onChange={(e) => {
            setCurrMsg(e.target.value);
          }}
          className=" w-full  h-full flex-grow border-none  text-base outline-none bg-gray-100 resize-none  overflow-y-auto p-3"
          placeholder="Write a message..."
        />
        <button onClick={sendMsg} className=" bg-primary-100 text-white p-2">
          <IoIosSend size={50} className="" />
        </button>
      </div>
    </div>
  );
}
