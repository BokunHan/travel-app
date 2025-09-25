import {
  type ClientLoaderFunctionArgs,
  Link,
  type MetaFunction,
  redirect,
} from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { SignInButton } from "@clerk/react-router";
import { getAuth } from "@clerk/react-router/ssr.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Tourvisto - Start Your Travel Journey" },
    {
      name: "description",
      content: "Manage destinations, itineraries, and user activity with ease.",
    },
  ];
};

export const loader = async (args: ClientLoaderFunctionArgs) => {
  try {
    const auth = await getAuth(args);

    if (auth.userId) return redirect("/");
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

const Sign_In = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>

          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>

            <p className="p-18-regular text-center text-gray-500 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          <SignInButton>
            <ButtonComponent
              type="button"
              iconCss="e-search-icon"
              className="button-class !h-11 !w-full"
            >
              <img
                src="/assets/icons/google.svg"
                className="size-5"
                alt="google"
              />
              <span className="p-18-semibold text-white">
                Sign in with Google
              </span>
            </ButtonComponent>
          </SignInButton>
        </div>
      </section>
    </main>
  );
};
export default Sign_In;
