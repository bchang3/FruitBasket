import { FormEvent, ChangeEvent, useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { NameCard } from "../NameCard";
import { cn, GameState, Player, toastError, toastSuccess } from "@/utils/utils";

interface LobbyScreenProps {
  socket: Socket;
  lobbyID: string;
  gameState: GameState;
}

export default function LobbyScreen({
  socket,
  lobbyID,
  gameState,
}: LobbyScreenProps) {
  const [host, setHost] = useState("");
  const [rounds, setRounds] = useState<number>(gameState.numRounds);
  const [guessTime, setGuessTime] = useState<number>(gameState.guessTime);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedCategoriesRef = useRef<string[]>([]);
  const roundInputRef = useRef<HTMLInputElement>(null);
  const guessTimeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const getCategories = async () => {
    const res = await fetch("/api/getCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const categories = await res.json();
      setCategoryOptions(categories);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
    getCategories();

    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowCategories(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const removePlayer = (player: Player) => {
    socket.emit("removePlayer", lobbyID, player.id);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidRound = roundInputRef.current?.reportValidity();
    const isValidGuess = guessTimeRef.current?.reportValidity();
    const isValid = isValidRound && isValidGuess;
    if (isValid) {
      for (const packet of [
        {
          inputRef: roundInputRef,
          store: rounds,
          setter: setRounds,
          emitEvent: "setNumRounds",
          successMsg: `Game will start with ${roundInputRef.current?.value} rounds!`,
          errorMsg: `Round number must be between 1 and 25!`,
        },
        {
          inputRef: guessTimeRef,
          store: guessTime,
          setter: setGuessTime,
          emitEvent: "setGuessTime",
          successMsg: `Guess round duration adjusted to ${guessTimeRef.current?.value} seconds!`,
          errorMsg: `Prompt round duration must be between 10-120 seconds!`,
        },
      ]) {
        if (packet.inputRef.current && packet.inputRef.current.value !== "") {
          const value = Number(packet.inputRef.current?.value);
          if (value === packet.store) {
            continue;
          }
          packet.setter(value);
          if (socket) {
            socket.emit(packet.emitEvent, lobbyID, value);
          }
          toastSuccess(packet.successMsg);
        } else {
          toastError(packet.errorMsg);
          if (packet.inputRef.current) {
            packet.inputRef.current.value = rounds.toString();
          }
        }
      }
    }
  };
  const startGame = () => {
    socket.emit("gameStart", lobbyID);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${host}${router.asPath}`);
      alert("Copied game link to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (roundInputRef.current) {
      roundInputRef.current.value = `${gameState.numRounds}`;
    }
    if (guessTimeRef.current) {
      guessTimeRef.current.value = `${gameState.guessTime}`;
    }

    socket.on("gameStateUpdate", (newState: GameState) => {
      if (
        roundInputRef.current &&
        roundInputRef.current.value !== `${newState.numRounds}`
      ) {
        toastSuccess(`Game will start with ${newState.numRounds} rounds!`);
        roundInputRef.current.value = `${newState.numRounds}`;
      }
      if (
        guessTimeRef.current &&
        guessTimeRef.current.value !== `${newState.guessTime}`
      ) {
        toastSuccess(
          `Guess round duration adjusted to ${newState.guessTime} seconds!`,
        );
        guessTimeRef.current.value = `${newState.guessTime}`;
      }
      if (
        selectedCategoriesRef.current &&
        selectedCategoriesRef.current !== newState.categories
      ) {
        selectedCategoriesRef.current = newState.categories;
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center w-full font-poppins gap-4 mt-16 md:mt-24 h-full align-top justify-between pb-12 md:pb-28 text-primary-green">
      <div className="flex flex-col items-center w-full h-full">
        <h1 className="text-5xl font-bold mb-4">Welcome to the lobby!</h1>
        <div
          className="hidden md:flex flex-row gap-2 items-center border-black border-2 rounded-md w-fit p-3 cursor-pointer"
          onClick={handleCopy}
        >
          {host}
          {router.asPath}
          <img src="/copy.svg" alt="copy icon" className="h-5 w-5" />
        </div>
        <div className="flex flex-col mb-7 md:w-4/5 w-full mt-12 md:mt-16">
          <h2 className="font-semibold text-2xl mb-4">Players:</h2>

          <div className="grid md:grid-cols-4  grid-cols-2 gap-y-2.5 gap-x-5 self-center w-full">
            {gameState.players.map((player, index) => (
              <NameCard
                player={player}
                removePlayer={removePlayer}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      <form
        className="flex flex-col items-center justify-center gap-4 mt-6"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        onBlur={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="flex flex-row gap-12 md:gap-12 items-center md:mb-4">
          <div
            className="hidden md:flex flex-col mt-6 w-[400px] gap-2 relative"
            ref={dropdownRef}
          >
            <div>
              <div className="flex flex-row justify-between">
                <button
                  onClick={() => setShowCategories(true)}
                  className="flex flex-row gap-2 cursor-pointer border-black border-2 rounded-md w-48 px-4 py-1 hover:bg-primary-dark_beige"
                >
                  Add Category
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <button
                  className="relative cursor-pointer group w-fit"
                  onClick={() => {
                    selectedCategoriesRef.current = [];
                    if (socket) {
                      socket.emit(
                        "setCategories",
                        lobbyID,
                        selectedCategoriesRef.current,
                      );
                    }
                  }}
                >
                  Clear All
                  <span className="absolute top-[28px] left-0 bottom-0 w-0 h-[2px] bg-primary-green transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
              <div
                className={cn(
                  "hidden absolute z-10 top-0 w-48 h-64 mt-8 left-0 overflow-y-scroll border-2 border-black bg-primary-beige flex-col rounded-b-md",
                  showCategories && "flex",
                )}
              >
                {categoryOptions.map((category) => {
                  return (
                    <button
                      key={category}
                      className="hover:bg-primary-dark_beige p-2"
                      onClick={() => {
                        if (selectedCategoriesRef.current.includes(category)) {
                          selectedCategoriesRef.current =
                            selectedCategoriesRef.current.filter(
                              (cat) => cat !== category,
                            );
                        } else {
                          selectedCategoriesRef.current = [
                            ...selectedCategoriesRef.current,
                            category,
                          ];
                        }
                        if (socket) {
                          socket.emit(
                            "setCategories",
                            lobbyID,
                            selectedCategoriesRef.current,
                          );
                        }
                        setShowCategories(false);
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 border-black border-2 rounded-md w-full h-32 p-4 font-bold text-xl text-primary-chestnut overflow-scroll">
              {selectedCategoriesRef.current.map((category, i) => {
                return (
                  <div key={category}>
                    {i + 1}. {category}
                  </div>
                );
              })}
              {selectedCategoriesRef.current.length == 0 && <div>All</div>}
            </div>
          </div>
          <div className="flex flex-col mt-2 items-center">
            <div className="text-base md:text-xl">Rounds:</div>
            <input
              className="border-2 border-black rounded-md h-10 md:h-12 pt-2 pb-1 px-2 w-20 md:w-24 overflow-x-auto text-center text-base md:text-xl"
              type="number"
              min={1}
              max={25}
              ref={roundInputRef}
            />
          </div>
          <div className="flex flex-col mt-2 items-center">
            <div className="text-base md:text-xl">Round Time:</div>
            <input
              className="border-2 border-black rounded-md h-10 md:h-12 pt-2 pb-1 px-2 w-20 md:w-24 overflow-x-auto text-center text-base md:text-xl"
              type="number"
              min={10}
              max={120}
              ref={guessTimeRef}
            />
          </div>
        </div>

        <button
          className="group font-medium text-4xl relative overflow-hidden mt-2"
          onClick={() => startGame()}
        >
          Start Game!
          <span className="absolute top-[36px] left-0 bottom-0 w-0 h-[2px] bg-primary-green transition-all duration-300 group-hover:w-full"></span>
        </button>
      </form>
    </div>
  );
}
