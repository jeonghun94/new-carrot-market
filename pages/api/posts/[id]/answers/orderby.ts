import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    body: { orderBy },
  } = req;

  const answers = await client.answer.findMany({
    where: {
      postId: Number(id),
    },
    include: {
      user: true,
    },
    orderBy: {
      id: orderBy,
    },
  });

  res.json({
    ok: true,
    answers,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
