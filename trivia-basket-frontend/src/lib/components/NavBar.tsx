import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { colorToHex } from "@/utils/utils";

function NavBar() {
  const [profileColor, setProfileColor] = useState<string>("");
  const [profileIcon, setProfileIcon] = useState<string>("");
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
        setProfileColor(data.profile_color);
        setProfileIcon(data.profile_icon);
        setHydrated(true);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex flex-row gap-2 items-center py-4 px-4 justify-between border-b-1 border-black">
      <div className="flex flex-row gap-2 items-center">
        <Link href="/">
          <img
            src="/trivia-basket-logo.svg"
            className="h-16 w-auto"
            alt="trivia basket logo"
          />
        </Link>
      </div>
      <div>
        {hydrated && (
          <Link href="/user/profile">
            <img
              className="rounded-full p-2 w-16 border-black border-2 cursor-pointer"
              src={`/fruit-icons/${profileIcon}.png`}
              style={{
                backgroundColor: `${colorToHex[profileColor as keyof typeof colorToHex]}`,
              }}
              alt="profile-icon"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
export default React.memo(NavBar);
