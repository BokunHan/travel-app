import { type MetaFunction, type LinksFunction, Outlet } from "react-router";
import RootNavbar from "../../../components/RootNavbar";
import heroImage from "/assets/images/hero-img.webp";

export const meta: MetaFunction = () => {
  return [
    { title: "Tourvisto - Your Ultimate Travel Planner" },
    {
      name: "description",
      content:
        "Plan your dream trip with Tourvisto. Customize your travel itinerary, discover handpicked destinations, and book your next adventure with ease.",
    },
  ];
};

export const links: LinksFunction = () => [
  // Preload the hero image for faster Largest Contentful Paint (LCP)
  {
    rel: "preload",
    href: heroImage,
    as: "image",
    // Adding fetchPriority is a good practice for critical resources
    // Note: The 'fetchPriority' property is not yet in the stable type definitions
    // for Remix's LinksFunction, so we cast it to any.
    // @ts-ignore
    fetchPriority: "high",
  },
];

// export async function clientLoader(args: ClientLoaderFunctionArgs) {
//   try {
//     const response = await fetch("/api/auth-callback");
//
//     if (!response.ok) {
//       return redirect("/sign-in");
//     }
//
//     const userData = await response.json();
//     return userData;
//   } catch (e) {
//     console.log("Error fetching user", e);
//     return redirect("/sign-in");
//   }
// }

const PageLayout = () => {
  return (
    <div className="bg-light-200">
      <RootNavbar />
      <Outlet />
    </div>
  );
};
export default PageLayout;
