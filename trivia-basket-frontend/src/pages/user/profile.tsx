import { cn, colors, colorToHex, fruit_icons } from "@/utils/utils";
import { useState, useEffect } from "react";

export default function Profile() {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hydrated, setHydrated] = useState<boolean>(false);

  const updateUserProfileImage = async (inputs: {
    username: string;
    profileColor: string;
    profileIcon: string;
  }) => {
    const res = await fetch("/api/updateUserImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    if (res.ok) {
      window.location.reload();
    }
  };

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
        setSelectedColor(data.profile_color);
        setSelectedIcon(data.profile_icon);
        setUsername(data.username);
        setPassword(data.password);
        setHydrated(true);
      }
    };
    fetchUser();
  }, []);
  const updateProfileIcon = (icon: string) => {
    setSelectedIcon(icon);
  };
  const updateProfileColor = (color: string) => {
    setSelectedColor(color);
  };
  return (
    <div className="flex justify-between text-center items-center w-full h-full  text-primary-green font-semibold">
      <div className="flex flex-col w-1/3 text-left gap-24 h-3/4">
        <div className="flex flex-col w-full text-5xl gap-6">
          <div>Username</div>
          <div className="text-primary-chestnut text-4xl">{username}</div>
        </div>
        <div className="flex flex-col w-full text-5xl gap-6">
          <div>Password</div>
          <div className="text-primary-chestnut text-4xl">{password}</div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-2/5 gap-12">
        <div className="text-5xl">My Icon</div>
        <div className="flex flex-col justify-center items-center gap-4">
          {hydrated && (
            <img
              className="rounded-full p-8 w-1/2 outline-black outline-2"
              src={`/fruit-icons/${selectedIcon}.png`}
              style={{
                backgroundColor: `${colorToHex[selectedColor as keyof typeof colorToHex]}`,
              }}
              alt="profile-icon"
            />
          )}
          <button
            className="relative group flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => {
              updateUserProfileImage({
                username,
                profileColor: selectedColor,
                profileIcon: selectedIcon,
              });
            }}
          >
            <div className="text-xl">Save</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
              <path d="M7 3v4a1 1 0 0 0 1 1h7" />
            </svg>
            <span className="text-md absolute top-[28px] left-0 bottom-0 w-0 h-[2px] bg-primary-green transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>

        <div className="flex flex-row justify-center gap-24 -ml-12 w-full">
          <div className="grid grid-cols-3 gap-4 w-1/2">
            {fruit_icons.map((icon) => {
              return (
                <img
                  key={icon}
                  onClick={() => updateProfileIcon(icon)}
                  className={cn(
                    "rounded-full p-2 w-20 outline-black outline-2 cursor-pointer",
                    selectedIcon === icon && "outline-6 outline-blue-400",
                  )}
                  src={`/fruit-icons/${icon}.png`}
                  alt="profile-icon"
                />
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => {
              return (
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg outline-1 outline-black cursor-pointer",
                    selectedColor === color && "outline-4 outline-blue-400",
                  )}
                  onClick={() => updateProfileColor(color)}
                  key={color}
                  style={{
                    backgroundColor: `${colorToHex[color as keyof typeof colorToHex]}`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
