import * as Sentry from "@sentry/react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "~/app.css?url";

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

import { registerLicense } from "@syncfusion/ej2-base";
import { rootAuthLoader } from "@clerk/react-router/ssr.server";
import { ClerkProvider } from "@clerk/react-router";

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const GOOGLE_SIGN_IN_URL = import.meta.env.VITE_GOOGLE_SIGN_IN_URL;
export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl={GOOGLE_SIGN_IN_URL}
      loaderData={loaderData}
    >
      <Outlet />
      <SpeedInsights />
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    Sentry.captureException(error);
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
