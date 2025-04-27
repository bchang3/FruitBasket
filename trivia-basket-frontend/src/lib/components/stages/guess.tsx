import { GameState, Player } from "@/utils/utils";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface GuessScreenProps {
  socket: Socket;
  gameState: GameState;
  lobbyID: string;
  player: Player;
}
export interface Guess {
  [id: string]: string;
}
export default function GuessScreen({
  socket,
  gameState,
  lobbyID,
  player,
}: GuessScreenProps) {
  const [idx, setIdx] = useState<number>(0);
  const [guessList, setGuessList] = useState<Player[]>(gameState.players);
  const guessRecord = useRef<Guess>({});
  // const [responses, setResponses] = useState(
  //   shuffleArray(gameState.players)
  //     .map((otherPlayer, index) => {
  //       if (otherPlayer.currentResponse) {
  //         return (
  //           <Response
  //             gameState={gameState}
  //             players={gameState.players}
  //             player={otherPlayer}
  //             setGuessList={setGuessList}
  //             guessRecord={guessRecord}
  //             key={index}
  //           />
  //         );
  //       }
  //     })
  //     .filter((r) => r !== undefined),
  // );
  useEffect(() => {
    const sendGuessTimeout = setTimeout(
      () => {
        const guess = guessRecord.current;
        socket.emit("savePlayerGuess", lobbyID, guess);
      },
      1000 *
        Math.floor(
          gameState.guessTime - (Date.now() - gameState.roundStartTime) / 1000,
        ),
    );
    return () => clearTimeout(sendGuessTimeout);
  }, []);

  return (
    <div className="h-fit font-fuzzy_bubbles">
      {/* <PlayerBar
        player={player}
        place={getPlayerPlace(gameState, player)}
        timer={true}
        duration={gameState.guessTime}
        startDate={gameState.roundStartTime}
      />
      <div className="flex flex-col items-center w-full gap-4 mt-32 h-2/3 md:h-full align-top justify-between pb-6 md:pb-48">
        <div className="flex flex-col items-center w-full gap-8">
          <h1 className="text-3xl md:text-5xl font-bold md:mb-4">
            Round {gameState.currentRound}
          </h1>
          <div className="flex gap-2 items-center text-2xl md:text-3xl">
            {gameState.currentQuestion}
            <div className="min-w-16">
              <IconTimer
                duration={gameState.guessTime}
                startDate={gameState.roundStartTime}
              />
            </div>
          </div>
          <div className="grid-cols-1 md:grid-cols-3 gap-4 w-full hidden md:grid">
            {responses.map((response) => response)}
          </div>
          <div className="flex flex-row w-full md:hidden items-center h-[150px]">
            <img
              src="/click-left.svg"
              className="w-12 h-12 cursor-pointer"
              onClick={() =>
                setIdx((prev) => {
                  return Math.max(prev - 1, 0);
                })
              }
            ></img>
            {responses.length > 0 && responses[idx]}
            {responses.length === 0 && (
              <div className="w-full text-center">No Responses!</div>
            )}
            <img
              src="/click-right.svg"
              className="w-12 h-12 cursor-pointer"
              onClick={() =>
                setIdx((prev) => {
                  return Math.min(prev + 1, responses.length - 1);
                })
              }
            ></img>
          </div>
        </div>
        <div className="max-h-96 overflow-scroll">
          <div
            className={`grid grid-cols-3 md:grid-cols-4 gap-4 justify-items-center items-center`}
          >
            {shuffleArray(guessList).map((otherPlayer, index) => (
              <MatchIcon player={otherPlayer} key={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="relative"></div> */}
    </div>
  );
}
