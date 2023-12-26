import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      fetcher.data !== "init" &&
      fetcher.state === "idle" &&
      textareaRef.current
    ) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="mt-2">
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state !== "idle"}
      >
        <div>
          <div>
            <input
              type="date"
              name="date"
              required
              className="text-gray-900"
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="mt-4 space-x-4">
            {[
              { label: "workout", value: "workout" },
              { label: "planing", value: "planing" },
              { label: "interesting things", value: "interesting-things" },
            ].map((option) => (
              <label key={option.value} className="inline-block">
                <input
                  required
                  type="radio"
                  className="mr-1"
                  name="type"
                  value="workout"
                  defaultChecked={option.value === (entry?.type ?? "workout")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <textarea
            ref={textareaRef}
            name="text"
            className="w-full text-gray-700"
            placeholder="Write your workout..."
            required
            defaultValue={entry?.text}
          />
        </div>
        <div className="mt-1 text-right">
          <button
            className="bg-blue-500 px-4 py-1 font-medium text-white"
            type="submit"
          >
            {fetcher.state !== "idle" ? "Saving..." : "Save"}
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
