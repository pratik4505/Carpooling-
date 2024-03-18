import { FaRegUser } from "react-icons/fa";
// import "./Chats.scss";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
export default function ChatList(props) {
  // const [unreadMsg, setUnreadMsg] = useState(undefined);
  // const gloContext = useContext(GlobalContext);

  // gloContext.socket.on("receiveMessage", (data) => {
  //   if (
  //     props.currChat &&
  //     props.currChat.chatId !== props.chat.chatId &&
  //     data.senderId === props.chat.otherMemberId
  //   ) {
  //     setUnreadMsg(data.message);
  //   }
  // });
  const [personName, chatPlaceWithTrailingParenthesis] =
    props.chat.chatName.split("(");
  const chatPlace = chatPlaceWithTrailingParenthesis.replace(/\)$/, "").trim();
  return (
    <>
      <div
        onClick={() => {
          props.onChatClick(props.chat);
        }}
        className={`flex items-center bg-green-100 p-3 rounded-md shadow-md cursor-pointer transition duration-300 hover:bg-green-200 ${
          props.currChat?._id === props.chat._id ? 'bg-yellow-100' : ''
        }`}
        
      >
        {props.chat.members[props.chat.driverId]?.imageUrl && (
          <img
            src={`${BASE_URL}/${
              props.chat.members[props.chat.driverId].imageUrl
            }`}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-2"
           
          />
        )}
        {!props.chat.members[props.chat.driverId]?.imageUrl && (
          <FaRegUser className="w-10 h-10 bg-red-500 rounded-full flex-shrink-0 mr-3" />
        )}
        
        <div className="flex flex-col">
          <p className="font-semibold text-lg text-gray-800">{personName}</p>
          <p className="font-semibold text-sm text-gray-800">{chatPlace}</p>
          {/* You can add more details here like last message, time, etc. */}
        </div>
        {/* Add unread message indicator if needed */}
        {/* {unreadMsg && props.currChat.chatId !== props.chat.chatId && (
    <span className="ml-auto px-2 py-1 text-sm font-semibold text-green-700 bg-green-200 rounded-full">
      {unreadMsg}
    </span>
  )} */}
      </div>
    </>
  );
}
