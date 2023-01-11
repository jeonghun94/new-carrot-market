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
    body: { state, purchaserId },
    session: { user },
  } = req;

  console.log(purchaserId);

  const productId = Number(id);

  if (purchaserId) {
    await client.purchase.create({
      data: {
        userId: purchaserId,
        productId,
      },
    });
  }

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
        state: state === "Hide" ? "Sale" : state,
      },
    });
  }
  const products = await client.product.findMany({
    where: {
      userId: user?.id,
    },

    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      createdAt: true,
      state: true,
      _count: {
        select: {
          favs: true,
          chats: true,
        },
      },
    },
  });

  res.send({ ok: true, products });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
