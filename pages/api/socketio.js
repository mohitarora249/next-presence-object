import { Server } from "socket.io";

const ioHandler = (req, res) => {
  let users = {};
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("send_cursor_info", (data) => {
        users = {
          ...users,
          [data.userId]: data.location,
        };
        socket.broadcast.emit("receive_cursor_info", users);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
