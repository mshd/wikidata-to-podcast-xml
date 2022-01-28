import getPodcastFromFeed, { Episode } from "podparse";

import { DateTime } from "luxon";
import axios from "axios";
import { createItem } from "./wikidataCreate";
import fs from "fs";
import { latestEpisode } from "../getEpisodes";

type d = { id: string; feedUrl: string; custom: any };

export async function readFeed(input: d) {
  let feed = await axios.get(input.feedUrl);
  feed = feed.data;
  // let feed = await fs.readFileSync(
  //   "/home/martin/workspace/wikidata-to-podcast-xml/src/example.xml",
  //   "utf-8"
  // );
  let res = getPodcastFromFeed(feed);
  // let episodes = await parseEpisodes(res.episodes, d.id);
  let latest = await latestEpisode(input.id);
  if (!latest || !latest.data || !latest.data[0].publicationDate) {
    return [];
  }
  let latestDate = DateTime.fromISO(latest.data[0].publicationDate);
  let parsedEpisodes = [];
  for (let i in res.episodes) {
    let pubDate = DateTime.fromISO(res.episodes[i].pubDate);
    //only create new episodes
    if (latestDate.plus({ days: 1 }) < pubDate) {
      let created = await createItem(res.episodes[i], input);
      parsedEpisodes.push(created);
    }
  }
  return parsedEpisodes;
}

async function parseEpisodes(episodes: Episode[]) {
  // episodes.forEach(async (element) => {
  //   await createItem(element);
  // });
}
