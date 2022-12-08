import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { product, content },
    session: { user },
  } = req;

  let chat;
  const alreadyExists = await client.chat.findFirst({
    where: {
      sellerId: Number(product.user.id),
      purchaserId: Number(user?.id),
    },
  });

  if (!alreadyExists) {
    chat = await client.chat.create({
      data: {
        sellerId: Number(product.user.id),
        purchaserId: Number(user?.id),
        productId: Number(product.id),
      },
    });
  }

  const chatContent = await client.chatMessage.create({
    data: {
      chatId: alreadyExists ? alreadyExists.id : Number(chat?.id),
      content,
    },
  });

  const chatting = await client.chat.findUnique({
    select: {
      seller: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      purchaser: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      chatMessages: {
        select: {
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          chatMessages: true,
        },
      },
    },
    where: {
      id: alreadyExists ? alreadyExists.id : Number(chat?.id),
    },
  });

  console.log(chatting, "chatting");

  res.json({
    ok: true,
    chatting: [],
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
