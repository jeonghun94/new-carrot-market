import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { message, product },
  } = req;

  const chat = await client.chat.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      product: {
        connect: {
          id: product.id,
        },
      },
    },
  });

  if (chat) {
    res.json({
      ok: true,
      chat,
    });
  } else {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
