import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  await req.session.destroy();

  res.redirect("/login");
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
