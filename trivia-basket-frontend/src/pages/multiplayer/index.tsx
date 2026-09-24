import LoadingScreen from "@/lib/components/LoadingScreen";
import CreateLobbyScreen from "@/lib/components/stages/createLobby";
import socketConnection from "@/lib/socket";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import env from "@beam-australia/react-env";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(socketConnection);
  // const socketURL = env("NEXT_PUBLIC_SOCKET_URL");

  useEffect(() => {
    socketConnection.on("connect_error", (err: Error) => {
      console.error(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Could not connect to server ${(window as any).__ENV.NEXT_PUBLIC_SOCKET_URL}!`,
      );
      console.error(err);
    });
    socketConnection.on("connect", () => {
      setSocket(socketConnection);
    });

    socketConnection.on("disconnect", () => {
      setSocket(null);
    });
  }, []);

  if (socket) {
    return <CreateLobbyScreen socket={socket} />;
  } else {
    return <LoadingScreen />;
  }
}
