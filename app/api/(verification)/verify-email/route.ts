import { client } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email } = await req.json();
    const user = await client.user.findFirst({
        where: {
            email,
        },
    });
    if (!user) {
        return Response.json({
            success: false,
            message: "No user exists with this email",
        });
    }
    return Response.json({
        success: true,
        message: "User found with this email",
        isVerified: user.isVerified,
        username: user.username,
    });
}
