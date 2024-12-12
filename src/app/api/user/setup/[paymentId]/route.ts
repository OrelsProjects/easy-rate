import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  const { paymentId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const stripe = getStripeInstance();
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { productId: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Invalid payment id" },
        { status: 400 }
      );
    }

    const product = await stripe.products.retrieve(payment.productId);
    const maxApiKeys = parseInt(product.metadata.maxApiKeys || "0");

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        userId: session.user.userId,
      },
    });

    const metadata = await prisma.appUserMetadata.findUnique({
      where: { userId: session.user.userId },
    });

    if (metadata?.maxApiKeys || 0 >= maxApiKeys) {
      return NextResponse.redirect(
        (process.env.NEXT_PUBLIC_APP_URL as string) + "/home"
      );
    }

    await prisma.appUserMetadata.upsert({
      where: { userId: session.user.userId },
      create: {
        userId: session.user.userId,
        maxApiKeys,
      },
      update: {
        maxApiKeys,
      },
    });

    return NextResponse.redirect(
      (process.env.NEXT_PUBLIC_APP_URL as string) + "/home"
    );
  } catch (error: any) {
    loggerServer.error(
      "Error retrieving payment intent",
      session?.user?.userId || "Unknown user",
      error
    );
    return NextResponse.json(
      { error: "Error retrieving payment intent" },
      { status: 500 }
    );
  }
}
