// import { NextApiRequest, NextApiResponse } from "next";
// import { getIronSession } from "iron-session";

// export default async function getMyId(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log(req.session, "req.session");
//   const { user } = await getIronSession(req, res, {
//     cookieName: "carrotsession",
//     password: process.env.COOKIE_PASSWORD!,
//   });
//   console.log(user, "?????");
//   res.send({ user });
// }

import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { getIronSession } from "iron-session";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getIronSession(req, res, {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PASSWORD!,
  });

  console.log(user, "user");

  res.json(user);
}

export default withApiSession(
  withHandler({ methods: ["GET"], handler, isPrivate: false })
);
