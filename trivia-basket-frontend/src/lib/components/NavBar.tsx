import Link from "next/link";
import React from "react";
import { useState } from "react";
// import { ClickAwayListener, Drawer, Popper } from "@mui/material";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [popperOpen, setPopperOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopperOpen(true);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [profileIconURL, setProfileIconURL] = useState<string>("");
  // const [cookies] = useCookies(["logged_in"]);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const getProfileIcon = async () => {
    const res = await fetch("/api/getprofileicon", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setProfileIconURL(data["profileIconURL"]);
    setUsername(data["username"]);
  };

  const handleClose = () => {
    setPopperOpen(false);
    setAnchorEl(null);
  };
  // useEffect(() => {
  //   setIsLoggedIn(cookies.logged_in || false);
  //   getProfileIcon();
  // }, [cookies]);

  const toggleMenu = (state: boolean) => {
    setMenuOpen(state);
  };
  // const logout = async () => {
  //   const res = await fetch("/api/logout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   setPopperOpen(false);
  //   router.push("/");
  // };
  // if (isLoggedIn === null) return <p>Loading...</p>;
  return (
    <div className="flex flex-row gap-2 items-center py-4 px-4 justify-between border-b-1 border-black">
      <div className="flex flex-row gap-2 items-center">
        <Link href="/">
          <img src="/trivia-basket-logo.svg" className="h-16 w-auto" />
        </Link>
      </div>
      <div>
        {!isLoggedIn && (
          <button className="group font-medium relative overflow-hidden mt-2">
            <a
              className="mr-8 font-bold cursor-pointer text-primary-green text-lg"
              href={"/"}
            >
              Sign in
            </a>
            <span className="text-md absolute top-[22px] left-0 bottom-0 w-0 h-[2px] bg-primary-green transition-all duration-300 group-hover:w-2/3"></span>
          </button>
        )}
        {isLoggedIn && profileIconURL && (
          <img
            className="rounded-full w-14 border-black border-2 cursor-pointer"
            src={profileIconURL}
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
}
export default React.memo(NavBar);
