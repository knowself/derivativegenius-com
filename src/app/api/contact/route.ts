import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().optional(),
  message: z.string().min(10, "Project description must be at least 10 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ContactSchema.parse(body);

    // Durable Lead Capture Logging / Provider Integration
    console.log("[DG-WEB INTAKE] New Project Inquiry Received:", {
      timestamp: new Date().toISOString(),
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company || "N/A",
      service: validatedData.service,
      budget: validatedData.budget || "Unspecified",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project scope received successfully",
        data: {
          name: validatedData.name,
          email: validatedData.email,
          service: validatedData.service,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error processing intake form" },
      { status: 500 }
    );
  }
}
