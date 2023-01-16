import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { Manner } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { manners, otherUserId, mutation, compliments } = req.body;
  const userId = Number(req.session.user?.id);

  if (mutation) {
    await client.compliment.deleteMany({
      where: {
        createdById: userId,
        createdForId: otherUserId,
      },
    });

    await client.user.update({
      where: {
        id: otherUserId,
      },
      data: {
        temperature: {
          decrement: 0.3 * compliments.length,
        },
      },
    });
    res.json({ ok: true });
    return;
  } else {
    manners.forEach(async (manner: Manner) => {
      console.log(manner);
      await client.compliment.create({
        data: {
          mannerId: manner.id,
          createdById: userId,
          createdForId: otherUserId,
        },
      });
    });

    await client.user.update({
      where: {
        id: otherUserId,
      },
      data: {
        temperature: {
          increment: 0.3 * manners.length,
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
