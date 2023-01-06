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
    body: { myLocation },
  } = req;

  await client.user.update({
    where: {
      id: user?.id,
    },
    data: {
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      address: myLocation.address,
    },
  });

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
