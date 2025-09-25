import React from "react";
import { Link, useLocation, useParams } from "react-router";
import { cn } from "~/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/react-router";

const RootNavbar = () => {
  const location = useLocation();
  const params = useParams();

  return (
    <nav
      className={cn(
        location.pathname === `/travel/${params.tripId}`
          ? "bg-white"
          : "glassmorphism",
        "w-full fixed z-50",
      )}
    >
      <header className="root-nav wrapper">
        <Link to="/" className="link-logo">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <aside>
          <SignedIn>
            <Link
              to="/dashboard"
              className={cn("text-base font-normal text-white", {
                "text-dark-100": location.pathname.startsWith("/travel"),
              })}
            >
              Dashboard
            </Link>

            <UserButton />
          </SignedIn>

          <SignedOut>
            <Link
              to="/sign-in"
              className={cn("text-base font-normal text-white")}
            >
              Sign In
            </Link>
          </SignedOut>
        </aside>
      </header>
    </nav>
  );
};
export default RootNavbar;
