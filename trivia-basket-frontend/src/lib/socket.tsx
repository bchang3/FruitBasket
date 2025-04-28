import { io } from "socket.io-client";

const socketURL =
  typeof window !== "undefined"
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__ENV.NEXT_PUBLIC_SOCKET_URL
    : "";
const socketConnection = io(socketURL, {
  reconnectionAttempts: 3,
  reconnectionDelay: 5000,
}); // Connect to the server
export default socketConnection;
