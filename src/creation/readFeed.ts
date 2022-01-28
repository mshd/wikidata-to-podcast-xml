import getPodcastFromFeed, { Episode } from "podparse";

//Q109238858
//@ts-ignore
import axios from "axios";
import { createItem } from "./wikidataCreate";

type d = { id: string; feedUrl: string };

export async function readFeed(input: d) {
  let feed = await axios.get(input.feedUrl);
  let res = getPodcastFromFeed(feed.data);
  // let episodes = await parseEpisodes(res.episodes, d.id);
  let parsedEpisodes = [];
  await createItem(res.episodes[0], input);
  return res;
}

async function parseEpisodes(episodes: Episode[]) {
  // episodes.forEach(async (element) => {
  //   await createItem(element);
  // });
}
