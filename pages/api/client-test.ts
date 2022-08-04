import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await client.user.create({
    data: {
      email: "jeongh1021@naver.com",
      name: "jeongh1021",
    },
  });

  res.json({
    ok: true,
    data: "ok",
  });
}
