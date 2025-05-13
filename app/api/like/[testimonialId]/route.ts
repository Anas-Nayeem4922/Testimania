import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ testimonialId: string }> }
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
        const testimonialId = (await params).testimonialId;
        const { isLiked } = await req.json();
        const testimonial = await client.testimonial.update({
            where: {
                id: testimonialId,
                userId,
            },
            data: {
                isLiked,
            },
        });
        if (!testimonial) {
            return Response.json({
                success: false,
                message: "No such testimonial exists",
            });
        }
        return Response.json({
            success: true,
            message:
                testimonial.isLiked ?
                    "Testimionial added to your wall of love ❤️"
                :   "Testimonial removed from your wall of love 💔",
            state: testimonial.isLiked,
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

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not logged in",
        });
    }
    try {
        const userId = user.id;
        const testimonials = await client.testimonial.findMany({
            where: {
                userId,
                isLiked: true,
            },
        });
        return Response.json({
            success: true,
            message: testimonials,
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
