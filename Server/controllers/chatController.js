const Chat=require('../models/Chat');

const Text=require('../models/Text')

const getChats=async(req,res)=>{
  const userId = req.userId;

  try {
    // Find all chats where a key of the map in the members field is equal to userId
    const chats = await Chat.find({ [`members.${userId}`]: { $exists: true } });
   
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
const getMessages=async(req,res)=>{
  try {
    const limit = parseInt(req.query.limit) || 50;
    const createdAt = req.query.createdAt
      ? new Date(req.query.createdAt)
      : new Date();
    const rideId = req.query.rideId;
    //console.log(rideId,req.query.createdAt);
    // Find messages based on chatId and createdAt
    const messages = await Text.find({
       rideId: rideId,
      //  createdAt: { $lt: createdAt },
    })
      .sort({ createdAt: -1 }) // Sort in descending order based on createdAt
      // .limit(limit);

      
    const revMessages = messages.reverse();

    res.status(200).json(revMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const postMessage=async(req,res)=>{
  try {
    const { senderId, rideId, message } = req.body;
    
    // Create a new message document
    const newMessage = new Text({
      senderId,
      rideId,
      message,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    //console.error("Error posting message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const createChat = async (req, res) => {
  const { userData, rideId } = req.body;

  try {
    // Find the chat associated with the provided rideId
    let chat = await Chat.findOne({ rideId: rideId });

    // Update the members of the existing chat
    chat.members.set(userData.userId, {
      name: userData.name,
      imageUrl: userData.imageUrl
    });

    // Save the updated chat
    await chat.save();

    // Send the updated chat as response
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getChats,
  getMessages,
  postMessage,
  createChat,
};
