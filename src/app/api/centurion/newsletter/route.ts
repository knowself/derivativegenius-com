import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscribers } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { centurionAuthorizationResponse, requireCenturionAction } from '@/lib/auth/centurion';

const createSubscriberSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(150, 'Email too long'),
  source: z.string().optional().default('centurion_manual'),
  status: z.enum(['subscribed', 'unsubscribed']).optional().default('subscribed'),
});

const updateSubscriberSchema = z.object({
  id: z.string().uuid('Invalid subscriber ID'),
  status: z.enum(['subscribed', 'unsubscribed']),
});

const deleteSubscriberSchema = z.object({
  id: z.string().uuid('Invalid subscriber ID'),
});

export async function GET() {
  try {
    await requireCenturionAction('read');

    if (!db) {
      return NextResponse.json({
        success: true,
        subscribers: [],
        stats: { total: 0, active: 0, unsubscribed: 0 },
      });
    }

    const list = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));

    const total = list.length;
    const active = list.filter((s) => s.status === 'subscribed').length;
    const unsubscribed = list.filter((s) => s.status === 'unsubscribed').length;

    return NextResponse.json({
      success: true,
      subscribers: list,
      stats: { total, active, unsubscribed },
    });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    console.error('[Centurion Newsletter GET]', error);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch newsletter subscribers' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireCenturionAction('read');

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const validated = createSubscriberSchema.parse(body);
    const normalizedEmail = validated.email.toLowerCase().trim();

    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        email: normalizedEmail,
        source: validated.source,
        status: validated.status,
      })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: {
          status: validated.status,
        },
      })
      .returning();

    return NextResponse.json({ success: true, subscriber });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation error' },
        { status: 400 },
      );
    }
    console.error('[Centurion Newsletter POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add subscriber' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireCenturionAction('read');

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const validated = updateSubscriberSchema.parse(body);

    const [updated] = await db
      .update(newsletterSubscribers)
      .set({
        status: validated.status,
      })
      .where(eq(newsletterSubscribers.id, validated.id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, subscriber: updated });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation error' },
        { status: 400 },
      );
    }
    console.error('[Centurion Newsletter PATCH]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscriber' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireCenturionAction('read');

    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    const body = await req.json();
    const validated = deleteSubscriberSchema.parse(body);

    const [deleted] = await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, validated.id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, subscriber: deleted });
  } catch (error: unknown) {
    const authorizationResponse = centurionAuthorizationResponse(error);
    if (authorizationResponse) return authorizationResponse;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validation error' },
        { status: 400 },
      );
    }
    console.error('[Centurion Newsletter DELETE]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscriber' },
      { status: 500 },
    );
  }
}
