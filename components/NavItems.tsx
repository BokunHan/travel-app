import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
import { SignedIn, SignOutButton, useUser } from "@clerk/react-router";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return;
  }

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${isActive ? "brightness-0 invert" : "text-dark-200"}`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <SignedIn>
            <img
              src={user?.imageUrl || "/assets/images/david.webp"}
              alt={user?.firstName || "David"}
            />

            <article>
              <h2>{user.fullName}</h2>
              <h2>{user.emailAddresses[0]?.emailAddress}</h2>
            </article>
          </SignedIn>

          <SignOutButton>
            <button className="cursor-pointer">
              <img
                src="/assets/icons/logout.svg"
                alt="logout"
                className="size-6"
              />
            </button>
          </SignOutButton>
        </footer>
      </div>
    </section>
  );
};
export default NavItems;
