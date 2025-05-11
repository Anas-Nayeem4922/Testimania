import { User } from "@/app/generated/prisma/client";
import { authOptions } from "@/lib/options";
import { client } from "@/lib/prisma";
import { questionSchema } from "@/schemas/questionSchema";
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
        const body = await req.json();
        const url = new URL(req.url);
        const spaceId = url.searchParams.get("spaceId") || "";
        const { success, error, data } = questionSchema.safeParse(body);
        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: error,
                },
                { status: 411 }
            );
        }
        await client.question.create({
            data: {
                message: data.message,
                userId,
                spaceId,
            },
        });
        return Response.json({
            success: true,
            message: "Question added successfully",
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: "Error while adding the question",
        });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const spaceId = url.searchParams.get("spaceId") || "";
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
        const questions = await client.question.findMany({
            where: {
                userId,
                spaceId,
            },
        });
        return Response.json({
            success: true,
            message: questions,
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err,
        });
    }
}

export async function PUT(req: Request) {
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
        const { id, message } = await req.json();
        const url = new URL(req.url);
        const spaceId = url.searchParams.get("spaceId") || "";

        const { success, error, data } = questionSchema.safeParse({ message });
        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: error,
                },
                { status: 411 }
            );
        }

        await client.question.update({
            where: {
                id,
                userId,
                spaceId,
            },
            data: {
                message: data.message,
            },
        });
        return Response.json({
            success: true,
            message: "Question updated successfully",
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: "Error while updating the question",
        });
    }
}

export async function DELETE(req: Request) {
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
        const { id } = await req.json();
        const url = new URL(req.url);
        const spaceId = url.searchParams.get("spaceId") || "";
        await client.question.delete({
            where: {
                id,
                userId,
                spaceId,
            },
        });
        return Response.json({
            success: true,
            message: "Question deleted successfully",
        });
    } catch (err) {
        return Response.json({
            success: false,
            message: err,
        });
    }
}
