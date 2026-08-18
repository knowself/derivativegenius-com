import { z } from 'zod';
import { db, schema } from '@/db';
import { sendLeadNotification } from '@/lib/mailer';

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(150, 'Email is too long'),
  company: z.string().trim().max(100, 'Company name is too long').optional().nullable(),
  service: z.string().trim().max(100).optional().nullable(),
  budget: z.union([z.string().trim(), z.number()]).optional().nullable(),
  message: z
    .string()
    .trim()
    .min(10, 'Project description must be at least 10 characters')
    .max(5000, 'Project description is too long'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.parse(body);

    const createdAt = new Date().toISOString();
    let leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (db) {
      try {
        const [inserted] = await db
          .insert(schema.prospects)
          .values({
            name: parsed.name,
            normalizedName: parsed.name.toLowerCase().trim(),
            industry: parsed.service || 'Web Development',
            status: 'raw',
            qualificationStatus: 'unverified',
          })
          .returning({ id: schema.prospects.id });
        if (inserted?.id) {
          leadId = inserted.id;
        }
      } catch (dbErr) {
        console.warn('[Contact Route] DB insertion fallback mode:', dbErr);
      }
    }

    await sendLeadNotification({
      name: parsed.name,
      email: parsed.email,
      company: parsed.company,
      service: parsed.service,
      budget: parsed.budget,
      message: parsed.message,
      leadId,
      createdAt,
    });

    return Response.json(
      {
        success: true,
        id: leadId,
        message: 'Project inquiry captured successfully.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    console.error('[Contact Route Error]', err);
    return Response.json(
      {
        success: false,
        error: 'An unexpected server error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
}
