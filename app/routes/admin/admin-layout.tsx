import { Outlet, redirect, type ClientLoaderFunctionArgs } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "../../../components";
import { getAuth } from "@clerk/react-router/ssr.server";
import { getExistingUser, storeUserData } from "~/lib/auth";

export const loader = async (args: ClientLoaderFunctionArgs) => {
  const request = args.request;
  const headers = request.headers;
  const cookie = headers.get("cookie");
  const client_uat = cookie
    ?.split("; ")
    .find((cookie) => cookie.startsWith("__client_uat="))
    ?.split("=")[1];

  const url = new URL(request.url);
  if (url.pathname === "/google/sign-in") return;

  try {
    const auth = await getAuth(args);
    if (client_uat === "0") return redirect("/sign-in");

    const existingUser = await getExistingUser(auth.userId as string);
    //if (existingUser?.status === "user") return redirect("/");

    return existingUser?.accountId
      ? existingUser
      : await storeUserData(auth.userId || "");
  } catch (e) {
    console.error("Error fetching user at admin-layout.tsx", e);
    return redirect("/sign-in");
  }
};

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};
export default AdminLayout;
