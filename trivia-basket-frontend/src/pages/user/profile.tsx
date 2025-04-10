import { cn, colors, colorToHex, fruit_icons } from "@/utils/utils";
import { useState, useEffect } from "react";

export default function Profile() {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hydrated, setHydrated] = useState<boolean>(false);

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
  const updateProfileImage = (icon: string) => {
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
        <div className="grid grid-cols-5 gap-4">
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
        <div className="flex flex-wrap items-center justify-center gap-4">
          {fruit_icons.map((icon) => {
            return (
              <img
                key={icon}
                onClick={() => updateProfileImage(icon)}
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
      </div>
    </div>
  );
}
