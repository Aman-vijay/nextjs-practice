import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "User team route is not implemented yet." },
    { status: 501 },
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: "User team update route is not implemented yet." },
    { status: 501 },
  );
}
