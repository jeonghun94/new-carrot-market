import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { content, latitude, longitude, image, postCategoryId },
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        content,
        latitude,
        longitude,
        image,
        postCategory: {
          connect: {
            id: postCategoryId,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    await res.revalidate("/community");
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude, categoryId },
    } = req;
    // const parsedLatitude = parseFloat(latitude.toString());
    // const parsedLongitue = parseFloat(longitude.toString());

    const posts = await client.post.findMany({
      where: {
        postCategory: {
          id: Number(categoryId),
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        postCategory: {
          select: {
            name: true,
          },
        },
        wondering: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            wondering: true,
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // where: {
      //   latitude: {
      //     gte: parsedLatitude - 0.01,
      //     lte: parsedLatitude + 0.01,
      //   },
      //   longitude: {
      //     gte: parsedLongitue - 0.01,
      //     lte: parsedLongitue + 0.01,
      //   },
      // },
    });
    res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
