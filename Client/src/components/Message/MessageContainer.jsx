import React, { useEffect, useState, useContext, useCallback } from "react";
import "./messageContainer.scss";


import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import {API} from "../../utils/api"
import { AuthContext } from "../../context/ContextProvider";
const msgPerLoad = 50;

let myId;

export default function MessageContainer(props) {
  const [messages, setMessages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [currMsg, setCurrMsg] = useState("");

  const {userData}=useContext(AuthContext);

  const messageLoader = async () => {
    try {
      const limit = msgPerLoad;
      const chatId = props.data.chatId;
      const createdAt =
        messages.length > 0 ? messages[0].createdAt : new Date();

      const response = await API.get(
        `/message/getMessages?limit=${limit}&chatId=${chatId}&createdAt=${createdAt}`
        
      );

      if (response.status===200) {
        const data = await response.data;

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
    
    myId = userData.userId
    setMessages([]);
    messageLoader();
    gloContext.socket.on("receiveMessage", (data) => {
      console.log("useEffect");
      if (data.senderId === props.data.otherMemberId) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              _id: uuidv4(),
              message: data.message,
              senderId: data.senderId,
              createdAt: data.createdAt,
              chatId: props.data.chatId,
            },
          ];
        });
      }
    });
  }, [props.data.chatId]);

  const sendMsg = async () => {
    const _id = uuidv4();

    const msg = currMsg;

    setMessages((prev) => {
      return [...prev, { _id: _id, senderId: myId, message: currMsg }];
    });
    setCurrMsg("");

    gloContext.socket.emit("sendMessage", {
      room: props.data.chatId,
      message: msg,
      senderId: myId,
      createdAt: new Date(),
      userData: gloContext.userData,
    });
    const data = {
      senderId: myId,
      chatId: props.data.chatId,
      message: msg,
    };

    try {
      const response = await API.post(
        `/message/postMessage`, data, {headers:{
          "Content-Type": "application/json",
        }
      }
      ); 

      if (response===500) {
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
        {props.data.otherMemberImageUrl && (
          <img
            className="w-12 h-12 rounded-full"
            src={`${baseUrl}/${props.data.otherMemberImageUrl}`}
            alt=""
          />
        )}
        {!props.data.otherMemberImageUrl && (
          <FaRegUser size={28} className="mx-2" />
        )}
        <h1 className="text-3xl ml-2 font-bold text-[#ffffff]">{props.data.otherMemberName}</h1>
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
        {messages.map((msg) => (
          <div
            className={`message ${
              msg.senderId === myId ? "outgoing" : "incoming"
            }`}
            key={msg._id}
          >
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
