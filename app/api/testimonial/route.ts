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
        const userId = user.id;
        const testimonials = await client.testimonial.findMany({
            where: {
                userId,
            },
        });
        let totalRating = 0;
        testimonials.forEach(
            (testimonial) => (totalRating += testimonial.rating)
        );
        return Response.json({
            success: true,
            message: "User found",
            totalTestimonials: testimonials.length,
            averageRating: parseFloat(
                (totalRating / testimonials.length).toFixed(2)
            ),
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err,
        });
    }
}
