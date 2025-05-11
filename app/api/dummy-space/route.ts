import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not logged-in",
        });
    }
    try {
        const userId = user.id;
        const space = await client.space.create({
            data: {
                header: "",
                description: "",
                userId,
            },
        });
        return Response.json({
            success: true,
            message: "Space created successfully. Fill in the details",
            spaceId: space.id,
        });
    } catch (err) {
        console.log(err);
        return Response.json({
            success: false,
            message: err,
        });
    }
}
