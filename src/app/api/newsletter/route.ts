import { z } from 'zod';
import { db, schema } from '@/db';

const SubscribeSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.').max(150, 'Email is too long.'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SubscribeSchema.parse(body);
    const normalizedEmail = parsed.email.toLowerCase().trim();

    if (db) {
      try {
        await db
          .insert(schema.newsletterSubscribers)
          .values({
            email: normalizedEmail,
            source: 'website_newsletter',
            status: 'subscribed',
          })
          .onConflictDoUpdate({
            target: schema.newsletterSubscribers.email,
            set: {
              status: 'subscribed',
            },
          });
      } catch (dbErr) {
        console.warn('[Newsletter Route] DB insertion fallback mode:', dbErr);
      }
    }

    return Response.json(
      {
        success: true,
        message: 'Thank you for subscribing!',
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const firstError = err.errors[0]?.message || 'Validation failed';
      return Response.json(
        {
          success: false,
          error: firstError,
          details: err.errors,
        },
        { status: 400 }
      );
    }

    console.error('[Newsletter Route Error]', err);
    return Response.json(
      {
        success: false,
        error: 'An unexpected error occurred while processing your subscription.',
      },
      { status: 500 }
    );
  }
}
