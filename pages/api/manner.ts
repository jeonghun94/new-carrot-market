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
    body: { otherUserId },
  } = req;

  const mannerWithCounts: any = new Array();
  const mannersCount = await client.compliment.groupBy({
    by: ["mannerId"],
    where: {
      createdForId: otherUserId,
    },
    orderBy: {
      mannerId: "desc",
    },
    _count: {
      id: true,
    },
  });

  for await (const manner of mannersCount) {
    const type = await client.manner.findUnique({
      where: {
        id: manner.mannerId,
      },
      select: {
        manner: true,
      },
    });

    const mannerWithCount = { count: manner._count.id, manner: type?.manner };
    mannerWithCounts.push(mannerWithCount);
  }

  console.log(mannerWithCounts);
  res.json({
    ok: true,
    mannerWithCounts,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
