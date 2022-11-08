import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { productId, userId },
  } = req;

  const seller = await client?.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      userId: true,
    },
  });

  const chatDate = await client?.chat.findMany({
    select: {
      createdAt: true,
    },
    where: {
      productId,
      userId: {
        in: [seller?.userId, userId],
      },
    },
  });

  let convertFormatDate = chatDate?.map((chat) => {
    return dayjs(chat.createdAt).format("YYYY년MM월DD일");
  });

  convertFormatDate = convertFormatDate?.filter(
    (v, i) => convertFormatDate.indexOf(v) === i
  );

  const chats = await client?.chat.findMany({
    include: {
      user: {
        select: {
          avatar: true,
          id: true,
        },
      },
    },
    where: {
      productId,
      userId: {
        in: [seller?.userId, userId],
      },
    },
  });

  const chatting = convertFormatDate?.map((day) => {
    return {
      day,
      message: chats?.filter((chat) => {
        return dayjs(chat.createdAt).format("YYYY년MM월DD일") === day;
      }),
    };
  });

  res.json({
    ok: true,
    chatting,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
