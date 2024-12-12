import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { sendMail } from "@/app/api/_utils/mail/mail";
import { generateSuccessfulPaymentMail } from "@/app/api/_utils/mail/templates";
import loggerServer from "@/loggerServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }
  try {
    const stripe = getStripeInstance();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session_id" },
        { status: 400 }
      );
    }

    const productId = session.metadata?.productId;
    const priceId = session.metadata?.priceId;

    if (!productId || !priceId) {
      return NextResponse.json(
        { error: "Invalid session_id" },
        { status: 400 }
      );
    }

    const product = await getStripeInstance().products.retrieve(productId);
    const price = await getStripeInstance().prices.retrieve(priceId);

    const payment = await prisma.payment.create({
      data: {
        sessionId,
        productId,
        priceId,
        productName: product.name,
        status: session.payment_status,
        amountReceived: (price.unit_amount as number) / 100,
        currency: price.currency as string,
      },
      select: {
        id: true,
      },
    });

    await sendMail(
      session.customer_details?.email as string,
      process.env.NEXT_PUBLIC_APP_NAME as string,
      ("You're almost done setting up " +
        process.env.NEXT_PUBLIC_APP_NAME) as string,
      generateSuccessfulPaymentMail(payment.id)
    );

    return NextResponse.redirect(
      req.nextUrl.origin + `/login?payment_id=${payment.id}`
  );
  } catch (error: any) {
    loggerServer.error(
      "Failed to complete subscription",
      "stripe callback",
      error
    );
    return NextResponse.redirect(req.nextUrl.origin + "/?error=true");
  }
}
