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

  const productId = Number(id);

  const exists = await client.fav.findFirst({
    where: {
      productId,
      userId: user?.id,
    },
  });

  if (exists) {
    await client.fav.delete({
      where: {
        id: exists.id,
      },
    });
  } else {
    await client.fav.create({
      data: {
        user: { connect: { id: user?.id } },
        product: { connect: { id: productId } },
      },
    });
  }

  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
