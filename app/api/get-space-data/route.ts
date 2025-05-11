import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not logged-in",
        });
    }
    try {
        const url = new URL(req.url);
        let spaceName = url.searchParams.get("spaceName") || "";
        spaceName = spaceName.replaceAll("-", " ").toLowerCase();
        console.log(spaceName, "spacename");
        const space = await client.space.findFirst({
            where: {
                name: spaceName,
            },
        });
        if (!space) {
            return Response.json(
                {
                    success: false,
                    message: "Space not found with this name",
                },
                { status: 403 }
            );
        }
        return Response.json({
            success: true,
            message: space,
        });
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: err,
            },
            { status: 500 }
        );
    }
}
