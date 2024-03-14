import { FaRegUser } from "react-icons/fa";

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

  return (
    <div
      onClick={() => {
        props.onChatClick(props.chat);
      }}
      className="flex p-3 shadow-sm "
    >
      <FaRegUser className="h-full w-[10%] mr-2" />

      <p>
        <b>{props.chat.chatName}</b>
      </p>
      {/* {unreadMsg && props.currChat.chatId !== props.chat.chatId && (
        <p className="text-green-500">{unreadMsg}</p>
      )} */}
    </div>
  );
}
