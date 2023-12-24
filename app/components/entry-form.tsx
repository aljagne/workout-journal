import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
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
              defaultValue={entry.date}
            />
          </div>

          <div className="mt-2 space-x-6">
            <label className="inline-block">
              <input
                required
                type="radio"
                className="mr-1"
                name="type"
                value="workout"
                defaultChecked={entry.type === "workout"}
              />
              Workout
            </label>
            <label className="inline-block">
              <input
                className="mr-1"
                type="radio"
                name="type"
                value="planing"
                defaultChecked={entry.type === "planing"}
              />
              Planing
            </label>
            <label className="inline-block">
              <input
                className="mr-1"
                type="radio"
                name="type"
                value="interesting-things"
                defaultChecked={entry.type === "interesting-things"}
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
            defaultValue={entry.text}
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
  );
}
