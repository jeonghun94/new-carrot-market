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
    body: { state },
  } = req;

  const productId = Number(id);

  const exists = await client.product.findFirst({
    where: {
      id: productId,
    },
  });

  if (exists) {
    await client.product.update({
      where: {
        id: productId,
      },
      data: {
        state,
      },
    });
  }

  res.send({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
