const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  memberIds: {
    type: [{ type: String, required: true }],
  },
  memberData: {
    type: [{
      name: String,
      imageUrl: String
    }],
  },
  chatName: {
    type: String,
    required: true,
  }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
