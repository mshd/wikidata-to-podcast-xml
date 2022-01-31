import type { NextApiRequest, NextApiResponse } from "next";

import { DESCRIPTIONS } from "../../../src/podcastDescriptions";
import { getPodcastFeed } from "../../../src/wikidata/getPodcastInfo";
import { readFeed } from "../../../src/import/readFeed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const podcastID = id as string;
  const podcastInfo = await getPodcastFeed(podcastID);
  // console.log(podcastInfo);
  // if (!podcastInfo[0]?.feed) {
  //   res.json({ error: true });
  //   return;
  // }
  const feedUrl = podcastInfo[0]?.feed;
  let podcastArray = DESCRIPTIONS.find((d: any) => d.id === podcastID);
  if (!podcastArray) {
    res.json({});
  }
  if (podcastArray?.presenter) {
    podcastArray.presenterId = podcastInfo[0].presenter.value;
  }
  if (!podcastArray?.spotifyShowId) {
    podcastArray.spotifyShowId = podcastInfo[0].spotifyShowId;
  }
  if (!podcastArray?.itunesShowId) {
    podcastArray.itunesShowId = parseFloat(podcastInfo[0].itunesShowId);
  }
  const feed = await readFeed({
    id: podcastID,
    feedUrl,
    custom: podcastArray,
  });
  res.json(feed);
}
