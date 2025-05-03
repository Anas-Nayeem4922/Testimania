import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { spaceSchema } from "@/schemas/spaceSchema";
import { getServerSession, User } from "next-auth";

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
        const body = await req.json();
        const { success, error, data } = spaceSchema.safeParse(body);
        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: error,
                },
                { status: 411 }
            );
        }
        const url = new URL(req.url);
        const spaceId = url.searchParams.get("spaceId") || "";
        await client.space.update({
            where: {
                id: spaceId,
            },
            data: {
                name: data.name,
                header: data.header,
                description: data.description,
                userName: data.userName,
                userEmail: data.userEmail,
                userAddress: data.userAddress,
                userSocials: data.userSocials,
                userId,
            },
        });
        return Response.json({
            success: true,
            message: "Your space details has been added successfully 🎉",
        });
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: err as Error,
            },
            { status: 400 }
        );
    }
}

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
        const userId = user.id;
        const spaces = await client.space.findMany({
            where: {
                userId,
            },
        });
        return Response.json(
            {
                success: true,
                message: spaces,
            },
            { status: 201 }
        );
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: err as Error,
            },
            { status: 400 }
        );
    }
}
