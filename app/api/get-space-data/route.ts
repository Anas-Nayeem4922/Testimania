import { client } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        let spaceName = url.searchParams.get("spaceName") || "";
        spaceName = spaceName.replaceAll("-", " ").toLowerCase();
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
