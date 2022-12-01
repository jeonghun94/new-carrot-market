import { NextRequest, NextResponse, userAgent } from "next/server";
export function middleware(req: NextRequest) {
  const ua = userAgent(req);

  //   console.log(ua);
  // if (!ua.isBot) {
  //   return NextResponse.json({ message: "Auth required" }, { status: 401 });
  // }

  // if (req.url.includes("community") && req.cookies.get("carrotsession")) {
  //   return NextResponse.redirect(`${req.nextUrl.origin}/`);
  // }
}
