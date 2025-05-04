import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ spaceId: string }> }
) {
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
        const spaceId = (await params).spaceId;
        const space = await client.space.findFirst({
            where: {
                id: spaceId,
                userId,
            },
        });
        if (!space) {
            return Response.json({
                success: false,
                message: "No space exists",
            });
        }
        return Response.json({
            success: true,
            message: space,
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err,
        });
    }
}
