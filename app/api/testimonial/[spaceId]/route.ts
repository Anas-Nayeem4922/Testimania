import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { testimonialSchema } from "@/schemas/testimonialSchema";
import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ spaceId: string }> }
) {
    try {
        const spaceId = (await params).spaceId;
        const space = await client.space.findFirst({
            where: {
                id: spaceId,
            },
        });
        if (!space) {
            return Response.json({
                success: false,
                message: "No such space exists with this id",
            });
        }
        const userId = space.userId;
        const body = await req.json();
        const { success, error, data } = testimonialSchema.safeParse(body);
        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: error,
                },
                { status: 411 }
            );
        }
        await client.testimonial.create({
            data: {
                userId,
                spaceId,
                review: data.review,
                rating: data.rating,
                userName: data.userName,
                userEmail: data.userEmail,
                userSocials: data.userSocials,
                userAddress: data.userAddress,
            },
        });
        return Response.json({
            success: true,
            message: "Testimonial sent successfully 🎉",
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
        const testimonial = await client.testimonial.findMany({
            where: {
                userId,
                spaceId,
            },
        });
        if (!testimonial) {
            return Response.json({
                success: false,
                message: "No testimonial found",
            });
        }
        return Response.json({
            success: true,
            message: testimonial,
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
