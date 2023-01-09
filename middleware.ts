import { getIronSession } from "iron-session/edge";
import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV! === "production", // if you are using https
    },
  });

  console.log("middleware", session.user, "미들웨어");

  if (!session.user && !req.url.includes("/login")) {
    // req.nextUrl.searchParams.set("from", "");
    req.nextUrl.pathname = "/login";
    return NextResponse.redirect(req.nextUrl);
  }
};

export const config = {
  matcher: ["/profile", "/chats"],
};
