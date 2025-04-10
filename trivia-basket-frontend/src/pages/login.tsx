import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const callLogin = async (inputs: { username: string; password: string }) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    if (res.ok) {
      router.push("/");
    } else {
      setError("Incorrect username or password!");
    }
  };
  return (
    <div className="flex flex-col justify-center text-center items-center gap-16 w-full h-full bg-primary-green">
      <div className="flex flex-col gap-4 items-center justify-center -mt-24">
        <img src="/trivia-basket-icon.png" className="w-48 h-auto" />
        <h1 className="text-white text-6xl font-semibold">
          Welcome to Trivia Basket!
        </h1>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          callLogin({
            username,
            password,
          });
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-white text-left font-semibold text-lg">
            Username:
          </p>
          <input
            required
            className="bg-primary-beige p-2 focus:border-primary-chestnut border-gray-700 focus:outline-none focus:ring-0 border-2 rounded-md h-12 text-md w-[600px]"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white text-left font-semibold text-lg">
            Password:
          </p>
          <input
            required
            className="bg-primary-beige p-2 focus:border-primary-chestnut border-gray-700 focus:outline-none focus:ring-0 border-2 rounded-md h-12 text-md w-[600px]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-row items-end justify-end cursor-pointer">
          <svg
            className="hover:scale-105"
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="36px"
            fill="white"
          >
            <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
          </svg>
        </div>
      </form>
    </div>
  );
}
