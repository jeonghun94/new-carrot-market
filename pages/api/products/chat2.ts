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
    body: { productId, code },
  } = req;

  const sellerId = await client?.product.findUnique({
    where: {
      id: Number(productId),
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
      productId: Number(productId),
      OR: [
        {
          // userId: Number(user?.id),
        },
        {
          userId: sellerId?.userId,
        },
      ],
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
      code,
      productId: Number(productId),
      userId: {
        // in: [Number(user?.id), Number(sellerId?.userId)],
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

  console.log(chatting);

  res.json({
    ok: true,
    chatting: chatting,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
