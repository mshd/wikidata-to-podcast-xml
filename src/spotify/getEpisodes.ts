import { Episode, EpisodeType } from "podparse";

import { DateTime } from "luxon";
import { EpisodeExtended } from "../creation/readFeed";
import { EpisodeObject } from "./episodeType";
import axios from "axios";

interface SpotifyResponse {
  next: string;
  items: EpisodeObject[];
}
export async function getShowEpisodes(
  playlistId: string,
  access_token: string,
  afterDate: DateTime
): Promise<EpisodeObject[]> {
  let items: any[] = [];
  let offset = 0;
  let nextPageToken = "start";
  do {
    console.log(
      "getting next page",
      "https://api.spotify.com/v1/shows/" + playlistId + "/episodes"
    );
    const page: SpotifyResponse = (
      await axios.get(
        "https://api.spotify.com/v1/shows/" + playlistId + "/episodes",
        {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            limit: 50,
            offset,
          },
        }
      )
    ).data;
    // console.log(page);
    offset += 50;
    nextPageToken = page.next;
    for (const item of page.items) {
      items.push(item);
    }
  } while (
    nextPageToken &&
    DateTime.fromISO(items[items.length - 1].pubDate) > afterDate
  );
  return items;
}
export function convertSpotifyToFeed(
  episodes: EpisodeObject[]
): EpisodeExtended[] {
  let items = [];
  for (const item of episodes) {
    let itemFeed: EpisodeExtended = {
      //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-episode
      title: item.name,
      duration: item.duration_ms / 1000,
      pubDate: item.release_date,
      explicit: item.explicit,
      description: item.description,
      spotifyId: item.href.split("episodes/")[1],
      image: item.images[0].url,
      author: "",
      summary: "",
      enclosure: { url: "" },
      // episodeType: EpisodeType.Full,
      lastBuildDate: "",
    };
    items.push(itemFeed);
  }
  return items;
}
