import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const alreadyExists = await client.heart.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id),
    },
    select: {
      id: true,
    },
  });
  if (alreadyExists) {
    await client.heart.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.heart.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
