import { z } from "zod";
import { db, schema } from "@/db";
import { sendLeadNotification } from "@/lib/mailer";

const AuditSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  business: z.string().trim().min(2, "Business name must be at least 2 characters").max(100),
  website: z.string().trim().max(200).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email("Invalid email address").max(150),
  industry: z.enum(["hvac", "pest-control"]),
});

const LABELS: Record<string, string> = {
  hvac: "Heating & Cooling",
  "pest-control": "Pest Control",
};

const SOURCES: Record<string, string> = {
  hvac: "/free-audit-hvac",
  "pest-control": "/free-audit-pest-control",
};

function normalizeWebsite(raw?: string | null): string | undefined {
  const w = (raw || "").trim();
  if (!w) return undefined;
  return /^https?:\/\//i.test(w) ? w : `https://${w}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AuditSchema.parse(body);
    const label = LABELS[parsed.industry];
    const createdAt = new Date().toISOString();
    let leadId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (db) {
      try {
        const [inserted] = await db
          .insert(schema.prospects)
          .values({
            name: parsed.name,
            normalizedName: parsed.name.toLowerCase().trim(),
            industry: label,
            status: "raw",
            qualificationStatus: "unverified",
            websiteUrl: normalizeWebsite(parsed.website),
            phone: parsed.phone?.trim() || undefined,
            sourceUrl: SOURCES[parsed.industry],
            notes: `Free audit request — business: ${parsed.business}, email: ${parsed.email}`,
            nextAction: "Send free 5-minute audit",
          })
          .returning({ id: schema.prospects.id });
        if (inserted?.id) leadId = inserted.id;
      } catch (dbErr) {
        console.warn("[Audit Route] DB insertion fallback mode:", dbErr);
      }
    }

    await sendLeadNotification({
      name: parsed.name,
      email: parsed.email,
      company: parsed.business,
      service: `Free Website Audit — ${label}`,
      message: `Free audit request from ${SOURCES[parsed.industry]}. Business: ${parsed.business}. Website: ${parsed.website || "not provided"}. Phone: ${parsed.phone || "not provided"}.`,
      leadId,
      createdAt,
    });

    return Response.json(
      { success: true, id: leadId, message: "Audit request captured." },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }
    console.error("[Audit Route Error]", err);
    return Response.json(
      { success: false, error: "Something went wrong saving your request. Please try again." },
      { status: 500 }
    );
  }
}
