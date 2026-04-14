import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Logout route is not implemented yet." },
    { status: 501 },
  );
}
