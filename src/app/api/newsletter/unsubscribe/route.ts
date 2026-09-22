import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { db, schema } from "@/db";

const UnsubscribeSchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = UnsubscribeSchema.parse(body);

    if (db) {
      await db
        .update(schema.newsletterSubscribers)
        .set({ status: "unsubscribed" })
        .where(
          or(
            eq(schema.newsletterSubscribers.unsubscribeToken, token),
            eq(schema.newsletterSubscribers.email, token.toLowerCase().trim())
          )
        );
    }

    return NextResponse.json({ success: true, message: "Successfully unsubscribed" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process unsubscribe" }, { status: 400 });
  }
}
