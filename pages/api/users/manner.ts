import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import { Manner } from "@prisma/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { manners, otherUserId } = req.body;

  const userId = Number(req.session.user?.id);

  // await client.compliment.deleteMany({});
  // return;

  // manners.forEach(async (manner: Manner) => {
  //   await client.compliment.create({
  //     data: {
  //       mannerId: manner.id,
  //       createdById: userId,
  //       createdForId: otherUserId,
  //     },
  //   });
  //   console.log("컴플리먼트 삽입");
  // });

  // manners.forEach(async (manner: Manner) => {
  //   console.log("dsdsds");
  //   await client.user.update({
  //     where: {
  //       id: otherUserId,
  //     },
  //     data: {
  //       receivedManners: {
  //         create: {
  //           mannerId: manner.id,
  //           createdById: userId,
  //         },
  //       },
  //     },
  //   });
  //   console.log("리시브 삽입");
  // });

  manners.forEach(async (manner: Manner) => {
    await client.user.update({
      where: {
        id: userId,
      },
      data: {
        writtenManners: {
          connectOrCreate: {
            where: {
              id: manner.id,
            },
            create: {
              mannerId: manner.id,
              createdForId: otherUserId,
            },
          },
        },
      },
    });
    console.log("롸이튼 삽입");
  });

  console.log("매너 업데이트");

  // await client.user.update({
  //   where: {
  //     id: otherUserId,
  //   },
  //   data: {
  //     temperature: {
  //       increment: 0.3 * manners.length,
  //     },
  //   },
  // });
  res.json({ ok: true });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
