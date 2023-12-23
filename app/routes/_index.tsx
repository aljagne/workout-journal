import { type MetaFunction, type ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import {
  useEffect,
  useRef,
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Workout Journal" },
    { name: "description", content: "Welcome to Workout Journal" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  let db = new PrismaClient();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);
  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  return db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
}
export async function loader() {
  let db = new PrismaClient();
  let entries = await db.entry.findMany();

  return entries;
}

export default function Index() {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let entries = useLoaderData<typeof loader>();

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className="p-10">
      <h1 className="text-5xl">Workout Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Planing and Workouts, Updated weekly
      </p>
      <div className="my-8 border p-3 ">
        <p className="italic">Add a new workout or planing</p>

        <fetcher.Form method="post" className="mt-2">
          <fieldset
            className="disabled:opacity-70"
            disabled={fetcher.state === "submitting"}
          >
            <div>
              <div className="mt-4">
                <input
                  type="date"
                  name="date"
                  required
                  className="text-gray-900"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
              </div>

              <div className="mt-2 space-x-6">
                <label className="inline-block">
                  <input
                    required
                    type="radio"
                    defaultChecked
                    className="mr-1"
                    name="type"
                    value="workout"
                  />
                  Workout
                </label>
                <label className="inline-block">
                  <input
                    className="mr-1"
                    type="radio"
                    name="type"
                    value="planing"
                  />
                  Planing
                </label>
                <label className="inline-block">
                  <input
                    className="mr-1"
                    type="radio"
                    name="type"
                    value="interesting-things"
                  />
                  Interesting things
                </label>
              </div>
            </div>
            <div className="mt-2">
              <textarea
                ref={textareaRef}
                name="text"
                className="w-full text-gray-700"
                placeholder="Write your workout..."
                required
              />
            </div>
            <div className="mt-1 text-right">
              <button
                className="bg-blue-500 px-4 py-1 font-medium text-white"
                type="submit"
              >
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

      {entries.map((entry) => (
        <p key={entry.id}>
          {entry.type} ◽ {entry.text}
        </p>
      ))}

      <div className="mt-6">
        <p className="font-bold">
          Week of December 15<sup>th</sup>
        </p>
        <div className="mt-3 space-y-4">
          <div>
            <p>Workout</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
          </div>
          <div>
            <p>Program</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
