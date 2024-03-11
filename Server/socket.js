const Notification = require("./models/Notification");

let io;
exports.init = (httpServer) => {
  io = require("socket.io")(httpServer);
  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

exports.runIO = (io) => {
  io.on("connection", (socket) => {
    console.log("client connected");

    socket.on("setup", async (room) => {
      // console.log("setup");
      socket.join(room.toString());
    });

    socket.on("handleRequest", async (data) => {
      try {
        const temp = {}; // Declare temp variable within the scope

        if (data.action === "accept") {
          temp.title = "Ride Request Accepted";
          temp.description = `${data.senderName} accepted your ride request`;
        } else {
          temp.title = "Ride Request Declined";
          temp.description = `${data.senderName} declined your ride request`;
        }

        const notify = new Notification({ ...temp, userId: data.sendTo });

        socket.to(data.sendTo).emit("notification", {...temp, type:'handleRequest'});
        // if (io.sockets.adapter.rooms.get(data.sendTo)) {
        //   notify.seen = true;
        // }

        await notify.save();
      } catch (error) {
        console.error("Error handling ride request:", error);
      }
    });
  });
};
