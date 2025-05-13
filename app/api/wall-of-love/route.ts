import { client } from "@/lib/prisma";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const spaceId = url.searchParams.get("spaceId");
    if (!spaceId) {
        return Response.json(
            {
                success: false,
                message: "No such space exists",
            },
            { status: 411 }
        );
    }
    try {
        const testimonials = await client.testimonial.findMany({
            where: {
                spaceId,
                isLiked: true,
            },
        });
        return Response.json({
            success: true,
            message: testimonials,
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err,
        });
    }
}
