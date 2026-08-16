import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const logLine = `[${new Date().toISOString()}] ${JSON.stringify(body)}\n`;
    const logDir = path.join(process.cwd(), 'logs');
    try { fs.mkdirSync(logDir, { recursive: true }); } catch (e) {}
    fs.appendFileSync(path.join(logDir, 'analytics.log'), logLine);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
