import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import "./messageContainer.scss";
import { Link } from "react-router-dom";
import { getMessages, postMessage } from "../../Api/chatApi";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import { checkToxicity } from "../../Api/perspectiveApi";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { AuthContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import FallbackLoading from "../loader/FallbackLoading";
import { MdPlace } from "react-icons/md";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
const msgPerLoad = 50;

let myId;

export default function MessageContainer(props) {
  const [messages, setMessages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [currMsg, setCurrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const { userData, socket } = useContext(AuthContext);
  const scrollRef = useRef(null);

  const messageLoader = async () => {
    try {
      const limit = msgPerLoad;
      const createdAt =
        messages.length > 0 ? messages[0].createdAt : new Date();
      const response = await getMessages(limit, props.data.rideId, createdAt);

      if (response.data) {
        const data = response.data;

        if (data.length > 0) {
          setMessages((prevMessages) => [...data, ...prevMessages]);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } else {
        console.error("Failed to fetch messages");
      }
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while fetching messages:", error);
    }
  };

  useEffect(() => {
    myId = userData.userId;
    if (!myId) return;
    setMessages([]);
    messageLoader();
    socket.on("receiveMessage", (data) => {
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
        scrollToBottom();
      }
    });
  }, [props.data.chatId]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  };

  const sendMsg = async () => {
    const _id = uuidv4();
    const msg = currMsg;

    if ((await checkToxicity(msg)) === true) {
      toast(<div>Warning : This message may be toxic</div>, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
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
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationMsg = `My current location is: <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View Location</a>`;
          setMessages((prev) => [
            ...prev,
            { _id: uuidv4(), senderId: myId, message: locationMsg },
          ]);

          // Post the location message to the server
          const data = {
            senderId: myId,
            rideId: props.data.rideId,
            message: locationMsg,
          };
          try {
            const response = await postMessage(data);
            if (response.error) {
              console.error("Failed to save message to the server");
            }
          } catch (error) {
            console.error(
              "An error occurred while posting the message:",
              error
            );
          }

          socket.emit("sendMessage", {
            room: props.data.rideId,
            message: locationMsg,
            senderId: myId,
            createdAt: new Date(),
            userData: userData,
          });
          scrollToBottom();
        },
        (error) => {
          console.error("Error getting the user's location:", error);
          toast.error("Error getting user location. Please try again later.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const [personName, chatPlaceWithTrailingParenthesis] =
    props.data.chatName.split("(");
  const chatPlace = chatPlaceWithTrailingParenthesis.replace(/\)$/, "").trim();
  console.log(props.data);
  return (
    <div className="w-full md:w-[70%] bg-white shadow-5xl">
      <div className="bg-primary-300 h-[10%]  flex items-center justify-between px-[2%]  ">
        <div className="flex items-center justify-between">
          <IoIosArrowBack
            size={28}
            color="#ffff"
            onClick={() => props.closeContainer()}
          />
          {props.data.members[props.data.driverId]?.imageUrl && (
            <img
              src={`${BASE_URL}/${
                props.data.members[props.data.driverId].imageUrl
              }`}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-2"
            />
          )}
          {!props.data.members[props.data.driverId]?.imageUrl && (
            <FaRegUser className="w-10 h-10 bg-red-500 rounded-full flex-shrink-0 mr-3" />
          )}

          {/* <FaRegUser size={28} className="mx-2" /> */}
          <div className="flex flex-col">
            <h1 className="text-2xl ml-2 text-[#ffffff]">{personName}</h1>
            <p className="text-1xl ml-2 text-[#ffffff]">{chatPlace}</p>
          </div>
        </div>
      </div>
      {loading && <FallbackLoading />}
      <ScrollToBottom
        className="flex flex-col overflow-y-auto h-[80%] px-2"
        ref={scrollRef}
      >
        {/* {loadMore && (
          <button
            onClick={messageLoader}
            className="btn btn-primary loadmore-messaging-section m-auto"
          >
            Load More
          </button>
        )} */}

        {messages &&
          messages.map((msg) => (
            <div
              className={`message ${
                msg.senderId === myId ? "outgoing" : "incoming"
              }`}
              key={msg._id}
            >
              <Link to={`/profile/${msg.senderId}`}>
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
                  {props.data.members[msg.senderId]?.name}
                </h3>
              </Link>
              <div dangerouslySetInnerHTML={{ __html: msg.message }} />
            </div>
          ))}
      </ScrollToBottom>
      <div className="flex w-full border-none  text-base outline-none bg-gray-100 h-[10%]">
        <button
          onClick={getLocation}
          className=" bg-primary-100 text-white p-2"
        >
          <MdPlace size={24} />
        </button>
        <textarea
          id="textarea"
          value={currMsg}
          onChange={(e) => {
            setCurrMsg(e.target.value);
          }}
          onKeyDown={handleKeyDown}
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
