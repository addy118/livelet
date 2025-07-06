import { HomePage } from "@/components/home/home";
import { LandingPage } from "@/components/home/landing-page";
import User from "@/data/user";
import { currentUser } from "@/lib/auth";

export default async function Home() {
  const user = await currentUser();
  if (!user || !user.id) {
    return (
      <main className="flex h-full flex-col items-center justify-center">
        <LandingPage />
      </main>
    );
  }

  const rooms = await User.getRooms(user.id);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <HomePage rooms={rooms} />
    </main>
  );
}
