import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { client } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email, username } = await req.json();
    // Send verification email
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
    );
    if (!emailResponse.success) {
        return Response.json(
            {
                success: false,
                message: emailResponse.message,
            },
            { status: 500 }
        );
    }
    await client.user.update({
        where: {
            email,
        },
        data: {
            verifyCode: verifyCode,
            verifyCodeExpiry: expiryDate,
        },
    });
    return Response.json(
        {
            success: true,
            message: "Verification code sent to your email",
        },
        { status: 201 }
    );
}
