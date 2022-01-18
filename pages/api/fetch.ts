import type { NextApiRequest, NextApiResponse } from "next";

import { Podcast } from "podcast";
import { createXML } from "../../src/main";
import fs from "fs";
import { fstat } from "fs";

type Data = {
  name: string;
  fetched: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  // const JordanPeterson = "Q109238858";
  const podcastId = id as string;
  let limit = 0;
  if (req.query.limit) {
    limit = parseInt(req.query.limit as string);
  }

  const feed = await createXML(podcastId, limit);
  console.log(__dirname);
  // fs.writeFileSync(
  //   __dirname + "/../../../../public/feeds/" + podcastId + ".xml",
  //   feed
  // );
  res.statusCode = 200;
  // res.json({ name: "Jordan Peterson", fetched: true });
  // res.setHeader("Content-Type", "application/xml");
  res.end(feed);
}
