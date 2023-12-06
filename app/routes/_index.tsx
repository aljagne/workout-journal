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

      <div className="mt-4">
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
