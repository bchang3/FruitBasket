import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { colorToHex } from "@/utils/utils";
import { ClickAwayListener, Drawer, Popper } from "@mui/material";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();
  const [profileColor, setProfileColor] = useState<string>("");
  const [profileIcon, setProfileIcon] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [popperOpen, setPopperOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
        setHydrated(true);
      }
    };
    fetchUser();
  }, []);
  const handleClose = () => {
    setPopperOpen(false);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopperOpen(true);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const logout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPopperOpen(false);
    router.push("/");
  };

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
          <img
            className="rounded-full p-2 w-16 border-black border-2 cursor-pointer"
            src={`/fruit-icons/${profileIcon}.png`}
            style={{
              backgroundColor: `${colorToHex[profileColor as keyof typeof colorToHex]}`,
            }}
            onClick={handleClick}
            alt="profile-icon"
          />
        )}
      </div>
      <Popper
        id="id"
        open={popperOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div className="flex flex-col w-48 border-gray-200 border-[1px] bg-primary-chestnut text-white rounded-md mt-2 py-2 px-2">
            <div className="font-bold p-2 px-1 text-xl">{username}</div>
            <div className="flex flex-col gap-1">
              <Link
                href="/user/profile"
                onClick={handleClose}
                className="text-gray-50  font-medium hover:font-bold hover:text-white hover:bg-primary-light_chestnut rounded-sm py-[3px] px-1"
              >
                Profile
              </Link>
              <Link
                href="/user/stats"
                onClick={handleClose}
                className="text-gray-50  font-medium hover:font-bold hover:text-white hover:bg-primary-light_chestnut rounded-sm py-[3px] px-1"
              >
                User Stats
              </Link>
              <Link
                href="/user/flashcards"
                onClick={handleClose}
                className="text-gray-50  font-medium hover:font-bold hover:text-white hover:bg-primary-light_chestnut rounded-sm py-[3px] px-1"
              >
                Flashcards
              </Link>
              <button
                onClick={logout}
                className="flex flex-row cursor-pointer justify-between text-gray-50 font-medium hover:font-bold hover:text-white hover:bg-primary-light_chestnut rounded-sm py-[3px] px-1"
              >
                Log Out
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                </svg>
              </button>
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}
export default React.memo(NavBar);
