import React, { PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBar from "./NavBar";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const isLoginPage = router.pathname.startsWith("/login");
  const hideNavBar = isLoginPage;

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        {!hideNavBar && <NavBar />}
        <main
          className={`flex flex-col mx-auto flex-1 min-h-[50vh] ${
            !isLoginPage ? "w-5/6" : "w-full"
          }`}
        >
          {children}
        </main>
        {/* {!isLoginPage && <Footer />} */}
      </div>
    </>
  );
};

export { Layout };
