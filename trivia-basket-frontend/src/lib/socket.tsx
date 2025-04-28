import { io } from "socket.io-client";

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL;
const socketConnection = io(socketURL, {
  reconnectionAttempts: 3,
  reconnectionDelay: 5000,
}); // Connect to the server
export default socketConnection;
