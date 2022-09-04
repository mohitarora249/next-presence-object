import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useCursorLocation = (userId) => {
  const [location, setLocation] = useState({ x: 0, y: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState({});
  const socket = io();
  const callback = (e) => {
    setLocation({ x: e.x, y: e.y });
    socket.emit("send_cursor_info", { userId, location: { x: e.x, y: e.y } });
  };

  useEffect(() => {
    setUsers({ ...users, [userId]: { x: 0, y: 0 } });
    fetch("/api/socketio").finally(() => {
      socket.on("connect", () => {
        setIsConnected(true);
      });
      socket.on("receive_cursor_info", (data) => {
        setUsers({ ...data });
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
      });
    });

    window.addEventListener("mousemove", callback);

    () => {
      window.removeEventListener("mousemove", callback);
    };
  }, []);
  return { location, isConnected, users };
};
