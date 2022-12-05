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
    body: { productId, userId, message, product, code, codeP },
    session: { user },
  } = req;

  if (message && product) {
    await client.chat.create({
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
        code: !code ? user?.id + "/" + product.userId : code,
        seller: user?.id === product.userId,
      },
    });
  }

  const sellerId = await client?.product
    .findUnique({
      where: {
        id: productId ? productId : product.id,
      },
      select: {
        userId: true,
      },
    })
    .then((res) => res?.userId);

  const chatCode = await client?.chat.findMany({
    distinct: ["code"],
    select: {
      code: true,
    },
    where: {
      productId: productId ? productId : product.id,
    },
  });

  const chatDate = await client.chat
    .findMany({
      select: {
        createdAt: true,
      },
      where: {
        productId: productId ? productId : product.id,
        userId: {
          in: [sellerId, userId ? userId : user?.id],
        },
      },
    })
    .then((data) =>
      data
        .map((i) => dayjs(i.createdAt).format("YYYY년MM월DD일"))
        .filter((i, index, array) => array.indexOf(i) === index)
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
      productId: productId ? productId : product.id,
      userId: {
        in: [sellerId, userId ? userId : user?.id],
      },
    },
  });

  const chatting = chatDate?.map((day) => {
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

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
