import type { NextApiRequest, NextApiResponse } from "next";

import { DESCRIPTIONS } from "../../../src/podcastDescriptions";
import { getPodcastFeed } from "../../../src/getPodcastInfo";
import { readFeed } from "../../../src/creation/readFeed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const podcastID = id as string;
  const podcastInfo = await getPodcastFeed(podcastID);
  if (!podcastInfo[0]?.feed) {
    res.json({ error: true });
  }
  const feedUrl = podcastInfo[0]?.feed;
  let podcastArray = DESCRIPTIONS.find((d: any) => d.id === podcastID);
  const feed = await readFeed({
    id: podcastID,
    feedUrl,
    custom: podcastArray,
  });
  res.json(feed);
}
