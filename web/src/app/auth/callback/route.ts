import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // simple redirection pour test
  return NextResponse.redirect(new URL("/", req.url));
}
