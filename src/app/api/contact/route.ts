import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.union([z.number(), z.string()]).optional(),
  message: z.string().min(10, 'Project description must be at least 10 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.parse(body);

    const db = getFirestore();

    if (!db) {
      console.warn('Contact form submitted without a configured database backend.');
      return NextResponse.json({ success: true, id: 'local-submit' }, { status: 201 });
    }

    const docRef = await db.collection('leads').add({
      name: parsed.name,
      email: parsed.email,
      message: parsed.message,
      company: parsed.company || null,
      service: parsed.service || null,
      budget: parsed.budget || null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError || err?._isZod) {
      return NextResponse.json({ success: false, error: err.errors || err.message }, { status: 400 });
    }
    console.error('Contact route error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
