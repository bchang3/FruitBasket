import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { Socket } from "socket.io-client";

import socketConnection from "@/lib/socket";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import LoadingScreen from "@/lib/components/LoadingScreen";
import EndScreen from "@/lib/components/stages/end";
import GuessScreen from "@/lib/components/stages/guess";
import LobbyScreen from "@/lib/components/stages/lobby";
import LobbyNotFound from "@/lib/components/LobbyNotFound";
import LoginScreen from "@/lib/components/stages/login";
import PromptScreen from "@/lib/components/stages/prompt";
import RevealScreen from "@/lib/components/stages/reveal";
import { GameState, getPlayerByID } from "@/utils/utils";
import InProgressScreen from "@/lib/components/InProgress";
import { useCookies } from "react-cookie";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ lobbyID: string }>,
) {
  const lobbyID = context.params?.lobbyID as string;
  return {
    props: { lobbyID }, // Pass the ID to the component
  };
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>();
  const [joinedGame, setJoinedGame] = useState<boolean>(false);
  const [lobbyNotFound, setLobbyNotFound] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(["socket_id"]);
  const router = useRouter();
  const { lobbyID } = router.query;

  const socket = useRef<Socket | null>(socketConnection);

  useEffect(() => {
    if (cookies.socket_id && socket.current) {
      socket.current.emit("joinGame", lobbyID, {
        prev_id: cookies.socket_id,
      });
    }
    socketConnection.on("gameStateUpdate", (newState: GameState) => {
      if (
        !newState.players.some((player) => player.id === socket.current?.id)
      ) {
        setJoinedGame(false);
      } else {
        setJoinedGame(true);
        setCookie("socket_id", socket.current?.id, { maxAge: 60 * 60 * 3 });
      }
      setGameState(newState);
    });
    if (socket.current) {
      socket.current.emit("joinLobby", lobbyID);
      setTimeout(() => setLobbyNotFound(true), 1000);
    }
  }, []);

  if (socket.current && socket.current.id && gameState) {
    if (gameState.stage === "Lobby") {
      if (joinedGame) {
        return (
          <LobbyScreen
            lobbyID={lobbyID as string}
            socket={socket.current}
            gameState={gameState}
          />
        );
      } else {
        return (
          <LoginScreen
            lobbyID={lobbyID as string}
            socket={socket.current}
            setJoinedGame={setJoinedGame}
          />
        );
      }
    } else if (joinedGame) {
      try {
        if (gameState.stage === "Prompt") {
          return (
            <PromptScreen
              socket={socket.current}
              gameState={gameState}
              lobbyID={lobbyID as string}
              player={getPlayerByID(gameState, socket.current.id)}
            />
          );
        } else if (gameState.stage === "Guess") {
          return (
            <GuessScreen
              player={getPlayerByID(gameState, socket.current.id)}
              socket={socket.current}
              lobbyID={lobbyID as string}
              gameState={gameState}
            />
          );
        } else if (gameState.stage === "Reveal") {
          return (
            <RevealScreen
              player={getPlayerByID(gameState, socket.current.id)}
              socket={socket.current}
              lobbyID={lobbyID as string}
              gameState={gameState}
            />
          );
        } else if (gameState.stage === "End") {
          return (
            <EndScreen
              player={getPlayerByID(gameState, socket.current.id)}
              socket={socket.current}
              gameState={gameState}
            />
          );
        }
      } catch (err) {
        setJoinedGame(false);
      }
    } else {
      return <InProgressScreen />;
    }
  } else if (!lobbyNotFound) {
    return <LoadingScreen />;
  } else {
    return <LobbyNotFound />;
  }
}
