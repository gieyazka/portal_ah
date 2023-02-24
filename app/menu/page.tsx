import SeverSes from "./sesverSession";

// import UserData from "./userData";

export default function HomePage() {
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <SeverSes />
    </div>
  );
}
