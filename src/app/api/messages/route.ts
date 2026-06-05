import { NextResponse } from "next/server";
import { sql, MAX_TEXT, MAX_NAME, type Message } from "@/app/lib/db";

// Render dinámico: el GET NUNCA se cachea, siempre lee la base de verdad.
export const dynamic = "force-dynamic";
// Corre en Node.js (lo más simple y predecible para el taller).
export const runtime = "nodejs";

// GET /api/messages -> devuelve los últimos 100 mensajes, el más nuevo primero.
export async function GET() {
  const rows = (await sql`
    SELECT id, name, text, created_at
    FROM messages
    ORDER BY created_at DESC, id DESC
    LIMIT 100
  `) as Message[];

  return NextResponse.json(rows, {
    headers: { "Cache-Control": "no-store" },
  });
}

// POST /api/messages -> guarda un mensaje nuevo en la base.
export async function POST(request: Request) {
  let body: { name?: unknown; text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Validación: el texto es obligatorio, el nombre es opcional.
  const rawText = typeof body.text === "string" ? body.text.trim() : "";
  const rawName = typeof body.name === "string" ? body.name.trim() : "";

  if (rawText.length === 0) {
    return NextResponse.json(
      { error: "El mensaje no puede estar vacío" },
      { status: 400 }
    );
  }
  if (rawText.length > MAX_TEXT) {
    return NextResponse.json(
      { error: `El mensaje es muy largo (máx ${MAX_TEXT})` },
      { status: 400 }
    );
  }
  if (rawName.length > MAX_NAME) {
    return NextResponse.json(
      { error: `El nombre es muy largo (máx ${MAX_NAME})` },
      { status: 400 }
    );
  }

  // Si no pusieron nombre, guardamos NULL.
  const name = rawName.length > 0 ? rawName : null;

  // Tagged template = consulta parametrizada = a prueba de inyección SQL.
  const rows = (await sql`
    INSERT INTO messages (name, text)
    VALUES (${name}, ${rawText})
    RETURNING id, name, text, created_at
  `) as Message[];

  return NextResponse.json(rows[0], { status: 201 });
}
