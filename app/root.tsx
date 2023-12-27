import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { destroySession, getSession } from "./session";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export default function App() {
  let { session } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="p-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl">Workout Journal</h1>
              <p className="mt-2 text-lg text-gray-400">
                Planing and Workouts, Updated weekly
              </p>
            </div>

            {session.isAdmin ? (
              <Form method="post">
                <button>Logout</button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>

          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
