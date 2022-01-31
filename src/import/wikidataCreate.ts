import {
  WD_BASED_ON_HEURISTIC,
  WD_CONTENT_DELIVERER,
  WD_DURATION,
  WD_EPISODE_TYPE_MATCH,
  WD_EXPLICIT_EPISODE,
  WD_FILE_FORMAT,
  WD_FULL_WORK_URL,
  WD_GUEST,
  WD_HAS_QUALITY,
  WD_INFERRED_FROM_PODCAST_DESCRIPTION,
  WD_INFERRED_FROM_TITLE,
  WD_INSTANCE_OF,
  WD_ITUNES_EPISODE_ID,
  WD_NUMBER,
  WD_PODCAST_EPISODE,
  WD_PODCAST_IMAGE_URL,
  WD_PRESENTER,
  WD_PRODUCTION_CODE,
  WD_PUBLICATION_DATE,
  WD_RECORDING_DATE,
  WD_SEASON,
  WD_SECOND,
  WD_SERIES,
  WD_SPOTIFY_EPISODE_ID,
  WD_STATED_IN_REFERENCE,
  WD_TITLE,
} from "../wikidata";
import {
  extractGuests,
  extractProductionCode,
  extractRecordingDate,
} from "./podcastExtracter";

// import { DateTime } from "luxon";
import { Episode } from "podparse";
import { EpisodeExtended } from "./readFeed";
import { generalConfig } from "./wikidataConfig";
import { searchGuest } from "./searchGuests";

const wbEdit = require("wikibase-edit")(generalConfig);

export async function createItem(episode: EpisodeExtended, podcast: any) {
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
  let guests = extractGuests(
    cleanTitle,
    podcast?.custom?.guestMatch,
    podcast?.custom?.guestMatchIndex
  );
  let today = new Date().toJSON().slice(0, 10);
  const reference = { P854: podcast.feedUrl, P813: today };
  let claims: any = {
    [WD_INSTANCE_OF]: [WD_PODCAST_EPISODE],
    [WD_TITLE]: [{ text: episode.title, language }],
    [WD_SERIES]: [podcast.id],
    [WD_DURATION]: [{ amount: Math.floor(episode.duration), unit: WD_SECOND }],
    [WD_PUBLICATION_DATE]: [
      {
        value: episode.pubDate.substring(0, 10),
      },
    ],
  };
  if (url) {
    claims[WD_FULL_WORK_URL] = [
      {
        value: url,
        qualifiers: {
          [WD_CONTENT_DELIVERER]: contentDelieverer,
          [WD_FILE_FORMAT]: fileFormat,
        },
        references: [reference],
      },
    ];
  }
  if (podcast.custom.seasons && episode.season) {
    let currentSeason = podcast.custom.seasons[episode.season];
    claims[WD_SEASON] = [
      {
        value: currentSeason,
        qualifiers: {
          [WD_NUMBER]: episode.episode?.toString(),
        },
        // references: [reference],
      },
    ];
  }

  if (podcast.custom?.presenterId) {
    claims[WD_PRESENTER] = [{ value: podcast.custom.presenterId }];
  }
  if (guests) {
    for (let guestId in guests) {
      if (!claims[WD_GUEST]) {
        claims[WD_GUEST] = [];
      }
      let guest = guests[guestId];
      let guestWikidata = await searchGuest(guest);
      let references = {
        [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_TITLE,
        [WD_STATED_IN_REFERENCE]: guest,
      };
      if (guestWikidata) {
        claims[WD_GUEST].push({
          value: guestWikidata,
          references,
        });
      } else {
        claims[WD_GUEST].push({
          value: {
            snaktype: "somevalue",
          },
          references,
        });
      }
    }
  }
  if (episode.image?.url) {
    claims[WD_PODCAST_IMAGE_URL] = [episode.image?.url];
  }
  let recordedDate = extractRecordingDate(episode.description);
  if (recordedDate) {
    claims[WD_RECORDING_DATE] = [
      {
        time: recordedDate.value,
        references: {
          [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_PODCAST_DESCRIPTION,
          [WD_STATED_IN_REFERENCE]: recordedDate.statedAs,
        },
      },
    ];
  }
  let hasQuality = [];
  if (episode.explicit) {
    hasQuality.push(WD_EXPLICIT_EPISODE);
  }
  const episodeTypeId = WD_EPISODE_TYPE_MATCH[episode.episodeType];
  if (episode.episodeType && episode.episodeType !== "full") {
    hasQuality.push(episodeTypeId);
  }
  if (episode.explicit) {
    claims[WD_HAS_QUALITY] = hasQuality;
  }
  if (episode.itunesId) {
    claims[WD_ITUNES_EPISODE_ID] = [{ value: episode.itunesId.toString() }];
  }
  if (episode.spotifyId) {
    claims[WD_SPOTIFY_EPISODE_ID] = [
      {
        value: episode.spotifyId,
      },
    ];
  }
  let productionCode = extractProductionCode(
    cleanTitle,
    podcast?.custom?.episodeMatch
  );
  if (productionCode) {
    claims[WD_PRODUCTION_CODE] = {
      value: productionCode,
      references: {
        [WD_BASED_ON_HEURISTIC]: WD_INFERRED_FROM_TITLE,
      },
    };
  }
  if (podcast.custom?.addClaims) {
    claims = { ...claims, ...podcast.custom.addClaims };
  }
  // return { labels, guests, claims, des: episode.description };

  console.log(claims);
  if (episode.wikidataId) {
    wbEdit.entity.edit({
      // Required
      id: episode.wikidataId,
      reconciliation: {
        mode: "skip-on-any-value",
      },
      // labels: [],
      descriptions,
      aliases,
      claims,
    });
    console.log("edited item id");
  } else {
    const { entity } = await wbEdit.entity.create({
      type: "item",
      labels,
      descriptions,
      aliases,
      claims,
      sitelinks: [],
    });
    console.log("created item id", entity.id);
  }
  // await new Promise((resolve) => setTimeout(resolve, 100000));

  return { labels, guests, claims, des: episode.description };
}
