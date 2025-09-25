import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
// import purgeCss from "vite-plugin-purgecss";
// import { visualizer } from "rollup-plugin-visualizer";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "bokun-han",
  project: "javascript-nextjs",
  // An auth token is required for uploading source maps;
  // store it in an environment variable to keep it secure.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // ...
};

export default defineConfig((config) => {
  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      eslint(),
      reactRouter(),
      sentryReactRouter(sentryConfig, config),
      // visualizer({ open: true }),
      // purgeCss({
      //   content: ["./index.html", "./app/**/*.{js,ts,jsx,tsx}"],
      //   safelist: {
      //     standard: [/^(e-|sf-)/],
      //     deep: [/^(e-|sf-)/],
      //     greedy: [/^(e-|sf-)/],
      //   },
      // }),
    ],
    build: {
      sourcemap: "hidden",
    },
    ssr: {
      noExternal: [/@syncfusion/],
    },
    envPrefix: ["VITE_", "CLERK_"],
  };
});
