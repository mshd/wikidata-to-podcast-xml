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

export async function createItem(episode: Episode, podcast: any) {
  const wbEdit = require("wikibase-edit")(generalConfig);
  const language = "en";
  const labels = {
    [language]: episode.title,
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
  console.log(claims);
  const { entity } = await wbEdit.entity.create({
    type: "item",
    labels,
    descriptions,
    aliases,
    claims,
    sitelinks: [],
  });
  console.log("created item id", entity.id);
  await new Promise((resolve) => setTimeout(resolve, 100000));
}