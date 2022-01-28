import {
  WD_BASED_ON_HEURISTIC,
  WD_CONTENT_DELIVERER,
  WD_DURATION,
  WD_FILE_FORMAT,
  WD_FULL_WORK_URL,
  WD_GUEST,
  WD_INFERRED_FROM_PODCAST_DESCRIPTION,
  WD_INFERRED_FROM_TITLE,
  WD_INSTANCE_OF,
  WD_PODCAST_EPISODE,
  WD_PODCAST_IMAGE_URL,
  WD_PRESENTER,
  WD_PUBLICATION_DATE,
  WD_RECORDING_DATE,
  WD_SECOND,
  WD_SERIES,
  WD_TITLE,
} from "../wikidata";

import { DateTime } from "luxon";
import { Episode } from "podparse";
import { generalConfig } from "./wikidataConfig";

const strtotime = require("locutus/php/datetime/strtotime");

const wbEdit = require("wikibase-edit")(generalConfig);

function extractGuests(text: string, regex: string) {
  try {
    let match = text.match(new RegExp(regex, ""));
    console.log(regex, match);
    let guests = match[1]
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
    let recorded = text.match(/recorded on ((.*) 20\d{2})/)?.[1];
    let recordedDate = new Date(strtotime(recorded + " GMT+0000") * 1000);
    return recordedDate.toISOString().substring(0, 10); //recordedDate;
  } catch (e) {}
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
  let cleanTitle = episode.title;
  if (podcast.custom?.remove) {
    cleanTitle = cleanTitle.replace(podcast.custom?.remove[0], "");
  }
  let guests = extractGuests(cleanTitle, podcast?.custom?.guestMatch);
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
  if (podcast.custom?.presenterId) {
    claims[WD_PRESENTER] = [podcast.custom.presenterId];
  }
  if (guests) {
    claims[WD_GUEST] = {
      text: guests,
      references: {
        [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_TITLE,
      },
    };
  }
  if (episode.image?.url) {
    claims[WD_PODCAST_IMAGE_URL] = [episode.image?.url];
  }
  let recordedDate = findRecordingDate(episode.description);
  if (recordedDate) {
    claims[WD_RECORDING_DATE] = [
      {
        time: recordedDate,
        references: {
          [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_PODCAST_DESCRIPTION,
        },
      },
    ];
  }
  if (podcast.custom?.addClaims) {
    claims = { ...claims, ...podcast.custom.addClaims };
  }
  // console.log(claims);
  return { labels, guests, claims, des: episode.description };
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
