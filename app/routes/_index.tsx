import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Workout Journal" },
    { name: "description", content: "Welcome to Workout Journal" },
  ];
};

export default function Index() {
  return (
    <div className="p-10">
      <h1 className="text-5xl">Workout Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Planing and Workouts, Updated weekly
      </p>
      <div className="my-8 border p-3 ">
        <form>
          <p className="italic">Add a new workout or planing</p>
          <div className="mt-4">
            <input type="date" name="date" className="text-gray-700" />
          </div>

          <div className="mt-2 space-x-6">
            <label>
              <input
                className="mr-1"
                type="radio"
                name="category"
                value="workout"
              />
              Workout
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="category"
                value="planing"
              />
              Planing
            </label>
            <label>
              <input
                className="mr-1"
                type="radio"
                name="category"
                value="interesting-things"
              />
              Interesting things
            </label>
          </div>
          <div className="mt-2">
            <textarea
              name=""
              className="w-full text-gray-700"
              placeholder="Write your workout..."
            />
          </div>
          <div className="mt-1 text-right">
            <button
              className="bg-blue-500 px-4 py-1 font-medium text-white"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>

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