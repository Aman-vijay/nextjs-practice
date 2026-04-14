import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Current user route is not implemented yet." },
    { status: 501 },
  );
}
