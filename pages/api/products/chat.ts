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
      OR: [
        // {
        //   sellerId: product.user.id,
        // },
        // {
        //   purchaserId: product.user.id,
        // },
        {
          productId: product.id,
          sellerId: userId,
        },
        {
          productId: product.id,
          purchaserId: userId,
        },
      ],
    },
  });

  console.log(product.id, product.user.id, userId);
  console.log(alreadyExists);

  if (!alreadyExists) {
    newChat = await client.chat.create({
      data: {
        productId: product.id,
        sellerId: product.user.id,
        purchaserId: userId,
      },
    });
  }

  if (alreadyExists && content) {
    await client.chatMessage.create({
      data: {
        userId,
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
          temperature: true,
        },
      },
      purchaser: {
        select: {
          id: true,
          name: true,
          avatar: true,
          temperature: true,
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
          userId: true,
        },
        orderBy: {
          createdAt: "asc",
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

  const chatMessages = Array.from(
    new Set(
      chat?.chatMessages.map((chatMessage) =>
        dayjs(chatMessage.createdAt).format("YYYY년MM월DD일")
      )
    )
  ).map((day) => {
    return {
      day,
      content: chat?.chatMessages?.filter((chat) => {
        return dayjs(chat.createdAt).format("YYYY년MM월DD일") === day;
      }),
    };
  });

  res.json({
    ok: true,
    chat: {
      ...chat,
      chatMessages,
    },
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
