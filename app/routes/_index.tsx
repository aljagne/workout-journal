import { type MetaFunction, type ActionFunctionArgs } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useRef } from "react";

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

  return entries.map((entry) => ({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  }));
}

export default function Index() {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let entries = useLoaderData<typeof loader>();

  let entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (memo, entry) => {
      let sunday = startOfWeek(parseISO(entry.date));
      let sundayString = format(sunday, "yyyy-MM-dd");

      memo[sundayString] ||= [];
      memo[sundayString].push(entry);

      return memo;
    },
    {},
  );

  let weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      workout: entriesByWeek[dateString].filter(
        (entry) => entry.type === "workout",
      ),
      planing: entriesByWeek[dateString].filter(
        (entry) => entry.type === "planing",
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "interesting-things",
      ),
    }));

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div>
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

      <div className="mt-12 space-y-12">
        {weeks.map((week) => (
          <div key={week.dateString}>
            <p className="font-bold">
              Week of {format(parseISO(week.dateString), "MMMM do")}
            </p>
            <div className="mt-3 space-y-4">
              {week.workout.length > 0 && (
                <div>
                  <p>Workout</p>
                  <ul className="ml-8 list-disc">
                    {week.workout.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.planing.length > 0 && (
                <div>
                  <p>Planing</p>
                  <ul className="ml-8 list-disc">
                    {week.planing.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.interestingThings.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  <ul className="ml-8 list-disc">
                    {week.interestingThings.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function EntryListItem({ entry }: {entry: Awaited<ReturnType<typeof loader>> [number]}) {
  return (
    <li className="group">
      {entry.text}
      <Link
        to={`/entries/${entry.id}/edit`}
        className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
      >
        Edit
      </Link>
    </li>
  );
}
