import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const categories = [
    { id: 1, name: "동네질문" },
    { id: 2, name: "동네사건사고" },
    { id: 3, name: "겨울간식" },
    { id: 4, name: "동네소식" },
    { id: 5, name: "동네맛집" },
    { id: 6, name: "취미생활" },
    { id: 7, name: "일상" },
    { id: 8, name: "분실/실종센터" },
    { id: 9, name: "해주세요" },
    { id: 10, name: "동네사진전" },
  ];

  for (const category of categories) {
    await client.postCategory.create({
      data: {
        name: category.name,
      },
    });
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
