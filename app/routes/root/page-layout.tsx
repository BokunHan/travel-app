import { SignOutButton } from "@clerk/react-router";
import { useNavigate } from "react-router";

const PageLayout = () => {
  const navigate = useNavigate();

  return (
    <div>
      <SignOutButton>
        <button className="cursor-pointer">
          <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
        </button>
      </SignOutButton>

      <button
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Dashboardd
      </button>
    </div>
  );
};
export default PageLayout;
