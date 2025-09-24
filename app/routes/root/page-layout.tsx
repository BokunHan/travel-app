import { type ClientLoaderFunctionArgs, Outlet, redirect } from "react-router";
import RootNavbar from "../../../components/RootNavbar";

export async function clientLoader(args: ClientLoaderFunctionArgs) {
  try {
    const response = await fetch("/api/auth-callback");

    if (!response.ok) {
      return redirect("/sign-in");
    }

    const userData = await response.json();
    return userData;
  } catch (e) {
    console.log("Error fetching user", e);
    return redirect("/sign-in");
  }
}

const PageLayout = () => {
  return (
    <div className="bg-light-200">
      <RootNavbar />
      <Outlet />
    </div>
  );
};
export default PageLayout;
