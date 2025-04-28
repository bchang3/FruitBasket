import { Socket } from "socket.io-client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { generateLobbyCode } from "@/lib/utils/utils";

interface CreateLobbyScreen {
  socket: Socket;
}

export default function CreateLobbyScreen({ socket }: CreateLobbyScreen) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const lobbyCodeRef = useRef<HTMLInputElement>(null);

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (socket && lobbyCodeRef.current) {
      const isValid = lobbyCodeRef.current.checkValidity();
      if (!isValid) {
        setError("Enter a join code!");
      } else {
        setError(null);
        router.push(`/multiplayer/${lobbyCodeRef.current.value}`);
      }
    }
  }
  function createLobby() {
    const lobbyCode = generateLobbyCode();
    socket.emit("createLobby", lobbyCode);
    router.push(`/multiplayer/${lobbyCode}`);
  }

  return (
    <div className="flex flex-col self-center w-full h-full font-poppins justify-center text-primary-green">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl self-center font-bold -mt-28">Trivia Basket</h1>
        <img src="/trivia-basket-icon.png" className="w-40" alt="basket icon" />
      </div>
      <form
        className="flex flex-col items-center mt-6 md:mt-16 self-center gap-4 w-full md:w-96 justify-center"
        onSubmit={(e) => {
          joinGame(e);
        }}
      >
        <div className="text-2xl"> Join game! </div>
        <input
          className="border-2 border-black rounded-md h-12 p-2 self-center w-full"
          placeholder="Game code..."
          required
          ref={lobbyCodeRef}
        ></input>
        {error && (
          <p style={{ color: "#f75757" }} className="self-end">
            {error}
          </p>
        )}
        <button type="submit" className="self-end cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="black"
          >
            <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
          </svg>
        </button>
        <button
          type="button"
          className="group cursor-pointer font-medium text-3xl relative mt-2 border-2 border-black rounded-md p-2 hover:bg-primary-dark_beige w-3/4"
          onClick={() => createLobby()}
        >
          {`Create Lobby`}
        </button>
      </form>
    </div>
  );
}
