import { Socket } from "socket.io-client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";

interface LoginScreenProps {
  socket: Socket;
  lobbyID: string;
  setJoinedGame: (arg: boolean) => void;
}

export default function LoginScreen({
  socket,
  lobbyID,
  setJoinedGame,
}: LoginScreenProps) {
  const [profileColor, setProfileColor] = useState<string>("");
  const [profileIcon, setProfileIcon] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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
        setProfileColor(data.profile_color);
        setProfileIcon(data.profile_icon);
        setUsername(data.username);
      }
    };
    fetchUser();
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["socket_id"]);
  const nameRef = useRef<HTMLInputElement>(null);

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (socket && nameRef.current) {
      const isValid = nameRef.current.checkValidity();
      if (!isValid) {
        setError("Enter a name!");
      } else {
        setError(null);
        const userData = {
          name: nameRef.current.value,
          profileColor,
          profileIcon,
          username,
          prev_id: cookies["socket_id"],
        };
        socket.emit("joinGame", lobbyID, userData);
        setCookie("socket_id", socket.id, { maxAge: 60 * 60 * 3 });
        setJoinedGame(true);
      }
    }
  }

  return (
    <div className="flex flex-col self-center w-full h-full font-fuzzy_bubbles justify-center text-primary-green">
      <h1 className="text-5xl self-center font-bold -mt-16">Join game!</h1>
      <form
        className="flex flex-col items-center mt-12 self-center gap-4 w-full md:w-96 justify-center"
        onSubmit={(e) => {
          joinGame(e);
        }}
      >
        <input
          className="border-2 border-black rounded-md h-12 p-2 self-center w-full"
          placeholder="Name..."
          required
          ref={nameRef}
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
      </form>
    </div>
  );
}
