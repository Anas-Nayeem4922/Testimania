import { authOptions } from "@/lib/options";
import { getServerSession } from "next-auth"

export default async function Home() {
  const session = await getServerSession(authOptions);
  if(session) {
    return <div className="bg-black min-h-screen text-white">
      <img src="./favicon.ico" alt="" className="h-20 w-20"/>
      {session.user?.email}
      
    </div>
  }
}