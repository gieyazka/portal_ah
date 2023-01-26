import SeverSes from "./sesverSession";
import UserData from "./userData";

export default function HomePage() {
  return (
    <div>
      <UserData>
        {/* @ts-expect-error Server Component */}
        <SeverSes />
      </UserData>
    </div>
  );
}
