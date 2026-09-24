import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import LoadingScreen from "@/lib/components/LoadingScreen";
import EndScreen from "@/lib/components/stages/end";
import GuessScreen from "@/lib/components/stages/guess";
import PromptScreen from "@/lib/components/stages/prompt";
import RevealScreen from "@/lib/components/stages/reveal";
import SinglePlayerSetup from "@/lib/components/stages/singleplayerSetup";
import useSinglePlayerGame from "@/lib/hooks/useSinglePlayerGame";
import { Player } from "@/utils/utils";

export default function SinglePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const { gameState, loading, startGame, submitGuess, nextRound, resetGame } =
    useSinglePlayerGame(player);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPlayer({
          id: "singleplayer",
          username: data.username,
          name: data.username,
          profileIcon: data.profile_icon,
          profileColor: data.profile_color,
          points: 0,
          currentResponse: "",
        });
      }
    };
    fetchUser();
  }, []);

  if (!player) {
    return <LoadingScreen />;
  }
  if (!gameState) {
    return <SinglePlayerSetup loading={loading} onStart={startGame} />;
  }

  // stage screens are shared with multiplayer, which expects a socket
  const noSocket = null as unknown as Socket;
  const currentPlayer = gameState.players[0];

  if (gameState.stage === "Prompt") {
    return <PromptScreen gameState={gameState} player={currentPlayer} />;
  } else if (gameState.stage === "Guess") {
    return (
      <GuessScreen
        socket={noSocket}
        lobbyID=""
        gameState={gameState}
        player={currentPlayer}
        isSinglePlayer={true}
        onGuess={submitGuess}
      />
    );
  } else if (gameState.stage === "Reveal") {
    return (
      <RevealScreen
        socket={noSocket}
        lobbyID=""
        gameState={gameState}
        player={currentPlayer}
        isSinglePlayer={true}
        onNext={nextRound}
      />
    );
  } else if (gameState.stage === "End") {
    return (
      <EndScreen
        socket={noSocket}
        gameState={gameState}
        player={currentPlayer}
        isSinglePlayer={true}
        onPlayAgain={resetGame}
      />
    );
  }
  return <LoadingScreen />;
}
