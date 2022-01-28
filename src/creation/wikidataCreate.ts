import {
  WD_CONTENT_DELIVERER,
  WD_DURATION,
  WD_FILE_FORMAT,
  WD_FULL_WORK_URL,
  WD_INSTANCE_OF,
  WD_PODCAST_EPISODE,
  WD_PODCAST_IMAGE_URL,
  WD_PUBLICATION_DATE,
  WD_SECOND,
  WD_SERIES,
  WD_TITLE,
} from "../wikidata";

import { Episode } from "podparse";
import { generalConfig } from "./wikidataConfig";

const wbEdit = require("wikibase-edit")(generalConfig);

function extractGuests(text: string, regex: string) {
  try {
    console.log(regex, text.matchAll(new RegExp(regex, "ig")));
    let guests = text
      .split("|")[1]
      .trim()
      .split(/,| and | \& |;/)
      .map((guest) => {
        return guest.trim();
      });
    return guests;
  } catch (e) {
    return [];
  }
}

function findRecordingDate(text: string) {
  try {
  } catch (e) {
    return;
  }
}

export async function createItem(episode: Episode, podcast: any) {
  const language = "en";
  let wikidataLabel = episode.title;
  if (podcast?.custom?.prefix) {
    wikidataLabel = podcast.custom.prefix + wikidataLabel;
  }
  const labels = {
    [language]: wikidataLabel,
  };
  const aliases = {
    [language]: episode.title,
  };
  const descriptions = {
    [language]: "podcast episode",
  };
  let url = episode.enclosure.url;
  let contentDelieverer = null;
  let fileFormat = "Q42591";
  if (url.match("traffic.megaphone.fm/")) {
    url =
      "https://traffic.megaphone.fm/" +
      url.split("traffic.megaphone.fm/")[1].split("?")[0];
    contentDelieverer = "Q29096473";
  }
  let guests = extractGuests(episode.title, podcast?.custom?.guestMatch);
  const reference = { P854: podcast.feedUrl };
  let claims: any = {
    [WD_INSTANCE_OF]: [WD_PODCAST_EPISODE],
    [WD_TITLE]: [{ text: episode.title, language }],
    [WD_SERIES]: [podcast.id],
    [WD_DURATION]: [{ amount: episode.duration, unit: WD_SECOND }],
    [WD_PUBLICATION_DATE]: [
      {
        value: episode.pubDate.substring(0, 10),
      },
    ],
    [WD_FULL_WORK_URL]: [
      {
        value: url,
        qualifiers: {
          [WD_CONTENT_DELIVERER]: contentDelieverer,
          [WD_FILE_FORMAT]: fileFormat,
        },
        references: [reference],
      },
    ],
  };
  if (episode.image?.url) {
    claims[WD_PODCAST_IMAGE_URL] = [episode.image?.url];
  }
  // console.log(claims);
  return { labels, guests };
  // const { entity } = await wbEdit.entity.create({
  //   type: "item",
  //   labels,
  //   descriptions,
  //   aliases,
  //   claims,
  //   sitelinks: [],
  // });
  // console.log("created item id", entity.id);
  await new Promise((resolve) => setTimeout(resolve, 100000));
}
