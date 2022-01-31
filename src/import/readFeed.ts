import { convertSpotifyToFeed, getShowEpisodes } from "../spotify/getEpisodes";
import getPodcastFromFeed, { Episode, Podcast } from "podparse";

import { DateTime } from "luxon";
import axios from "axios";
import { createItem } from "./wikidataCreate";
import fs from "fs";
import { getItunesShowEpisodes } from "../itunes/getEpisodes";
import { latestEpisode } from "../wikidata/getEpisodes";

type d = { id: string; feedUrl: string; custom: any };

//https://developer.spotify.com/console/post-playlists/
const token =
  "BQBYmjFApbUjkZp653BNZB-Sgz1ckvRA_jGgt1oc8XCsGROdGBg9m3uMwGJcSnvNDf1K7QqScyrLgI7VTnKgeb1HkRNuteA_XOK8FssN-sPYwVYQFdMaCdfiHDUlXLedw5btB4UpwoqBaaOAJaLjtFFfIIniKBkmcIHU3YYtaGq8Ic5u-W890KyeJPyIza09Nfns4cWUTiJz6BdjPjkOcJ75anjSk6vHxKMZFCPtOLB7h88Uuu__";

export interface EpisodeExtended extends Episode {
  spotifyId?: string;
  itunesId?: number;
  fyydId?: string;
  panoptikumId?: string;
}

export async function readFeed(input: d) {
  // let feed = (await axios.get(input.feedUrl)).data;
  let feed = await fs.readFileSync(
    "/home/martin/workspace/wikidata-to-podcast-xml/src/example/example.xml",
    "utf-8"
  );
  let res = getPodcastFromFeed(feed);
  let latest = await latestEpisode(input.id);
  if (latest.data == 0) {
    latest.data = [{ publicationDate: "2000-01-01" }];
  } else if (!latest || !latest.data || !latest.data[0].publicationDate) {
    return [];
  }
  //  let latestDate = DateTime.fromISO(latest.data[0].publicationDate);

  let latestDate = DateTime.fromISO("2021-12-30");
  let episodes = res.episodes as EpisodeExtended[];
  // episodes = await mergeWithApple(episodes, input.custom.itunesShowId);
  // episodes = await mergeWithSpotify(
  //   episodes,
  //   input.custom.spotifyShowId,
  //   latestDate
  // );
  let parsedEpisodes = [];

  for (let i in res.episodes.reverse()) {
    let pubDate = DateTime.fromISO(res.episodes[i].pubDate);
    //only create new episodes
    if (latestDate.plus({ days: 1 }) < pubDate) {
      console.log(res.episodes[i].title);
      let created = await createItem(res.episodes[i], input);
      parsedEpisodes.push(created);
    }
  }
  return parsedEpisodes;
}

async function mergeWithApple(
  episodes: EpisodeExtended[],
  itunesShowId: number
) {
  let apple = await getItunesShowEpisodes(itunesShowId);
  for (let i in episodes) {
    let match = apple.filter(
      (episode) => episode.episodeGuid === episodes[i].guid
    );
    if (match.length) {
      episodes[i].itunesId = match[0].trackId;
    }
  }
  return episodes;
}

async function mergeWithSpotify(
  episodes: EpisodeExtended[],
  spotifyShowId: string,
  latestDate: DateTime
) {
  let spotifyEpisodes = await getShowEpisodes(spotifyShowId, token, latestDate);
  for (let i in episodes) {
    let match = spotifyEpisodes.filter(
      (episode) => episode.name === episodes[i].title //match title because Spotify doesn't have GUID
    );
    if (match.length) {
      episodes[i].spotifyId = match[0].href.split("episodes/")[1];
    }
  }
  return episodes;
}

export async function readSpotify(input: d) {
  let latest = await latestEpisode(input.id);
  if (latest.data == 0) {
    latest.data = [{ publicationDate: "2000-01-01" }];
  } else if (!latest || !latest.data || !latest.data[0].publicationDate) {
    return [];
  }
  let latestDate = DateTime.fromISO(latest.data[0].publicationDate);
  // console.log(input.custom.itunesShowId);
  let res = convertSpotifyToFeed(
    await getShowEpisodes(input.custom.spotifyShowId, token, latestDate)
  );
  // console.log(res);
  // return res;
  input.custom.spotifyOnly = true;
  let parsedEpisodes = [];
  for (let i in res.reverse()) {
    let pubDate = DateTime.fromISO(res[i].pubDate);
    //only create new episodes
    if (latestDate.plus({ days: 1 }) < pubDate) {
      let created = await createItem(res[i], input);
      return created;
      await new Promise((resolve) => setTimeout(resolve, 100000));

      parsedEpisodes.push(created);
    }
  }
  return parsedEpisodes;
}
