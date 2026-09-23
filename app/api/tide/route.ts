import { NextResponse } from "next/server";
import { getUpcomingHighTides } from "@/lib/tide";

// Próximas preia-mares no Montijo (usado pela pré-visualização do /admin).
export const dynamic = "force-dynamic";

export async function GET() {
  const tides = await getUpcomingHighTides();
  return NextResponse.json({ tides });
}
