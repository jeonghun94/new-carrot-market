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
    body: { product, content, userId: loginId },
    session: { user },
  } = req;

  let newChat;
  const userId = user ? Number(user.id) : loginId;
  const alreadyExists = await client.chat.findFirst({
    where: {
      sellerId: Number(product.user.id),
      purchaserId: userId,
    },
  });

  if (!alreadyExists) {
    newChat = await client.chat.create({
      data: {
        sellerId: Number(product.user.id),
        purchaserId: userId,
        productId: product.id,
      },
    });
  }

  if (content) {
    await client.chatMessage.create({
      data: {
        chatId: alreadyExists ? alreadyExists.id : Number(newChat?.id),
        content,
      },
    });
  }

  const chat = await client.chat.findUnique({
    select: {
      id: true,
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
      id: alreadyExists ? alreadyExists.id : Number(newChat?.id),
    },
  });

  res.json({
    ok: true,
    chat,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
