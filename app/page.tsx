import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth"

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session) {
    return <div>
      {session.user?.email}
      {session.user?.image}
      {session.user?.name}
    </div>
  }
}