import { NextResponse } from "next/server";

export async function PATCH() {
  return NextResponse.json(
    { error: "User role route is not implemented yet." },
    { status: 501 },
  );
}
