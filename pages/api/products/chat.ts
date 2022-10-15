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
    session: { user },
    body: { message, product, code },
  } = req;

  console.log(code, "code 들어옴");

  const chat = await client.chat.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      product: {
        connect: {
          id: product.id,
        },
      },
      code: !code ? Math.floor(100000 + Math.random() * 900000) + "" : code,
    },
  });

  if (chat) {
    const sellerId = await client?.product.findUnique({
      where: {
        id: Number(product.id),
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
        productId: Number(product.id),
        OR: [
          {
            userId: Number(user?.id),
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
        code: chat.code,
        productId: Number(product.id),
        userId: {
          in: [Number(user?.id), Number(sellerId?.userId)],
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

    // console.log(sellerId, "sellerId");
    // console.log(chatDate, "chatDate");
    // console.log(chatting, "result");

    res.json({
      ok: true,
      chat,
      chatting,
    });
  } else {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
