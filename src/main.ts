import { DESCRIPTIONS } from "./podcastDescriptions";
import { Podcast } from "podcast";
import { getEpisodesById } from "./getEpisodes";
import { getPodcastInfo } from "./getPodcastInfo";
import { wikidataGetEntities } from "./getWikidataEntities";

const EXPLICIT_EPISODE = "Q109501804";
const PODCAST = "Q24634210";
export async function createXML(
  podcastId: string,
  limit: number
): Promise<string | null> {
  const podcast = await wikidataGetEntities([podcastId]);
  if (!podcast.claims) {
    return null;
  }
  const claims = podcast.claims;
  let descr = "";
  if (claims.P5842) {
    descr += `<br />External links: https://podcasts.apple.com/podcast/id${claims.P5842[0].value}`;
    //<a href="https://podcasts.apple.com/podcast/id${claims.P5842[0].value}">Apple Podcasts</a>
  }
  if (!claims.P31) {
    return null;
  }
  if (!claims.P31.map((claim: any) => claim.value).includes(PODCAST)) {
    return null;
  }
  const podcastInfo = await getPodcastInfo(podcastId);
  console.log(podcastInfo);
  const episodes = await getEpisodesById(podcastId, limit);
  descr += `<br />This podcast might be out of date. Contact us to have it updated.<a href="${episodes.link}" target="_blank"></a>`;
  // if (podcastInfo.topics) {
  //   descr += `<br />Topics: ${podcastInfo.topics}`;
  // }
  let imageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/2/27/Square%2C_Inc_-_Square_Logo.jpg";
  let podcastArray = DESCRIPTIONS.find((d: any) => d.id === podcastId);
  if (podcastArray) {
    descr = `${podcastArray.description}<br />${descr}`;
    imageUrl = podcastArray.img;
  }
  const feed = new Podcast({
    title: podcast.labels.en,
    description:
      descr +
      `<br /><br />This podcast is auto-generated.<br>Language: ${podcastInfo[0].language?.label}`,
    feedUrl: "https://podcast.nothispute.com/api/feed/" + podcastId + "",
    siteUrl: claims.P856?.[0].value,
    imageUrl: imageUrl,
    // docs: "http://example.com/rss/docs.html",
    // author: "Dylan Greene",
    // managingEditor: "Dylan Greene",
    // webMaster: "Dylan Greene",
    // copyright: "2013 Dylan Greene",
    language: podcastInfo[0].language?.code || "en",
    // categories: ["Category 1", "Category 2", "Category 3"],
    pubDate: claims.P580?.[0].value,
    ttl: 60,
    // itunesAuthor: "Max Nowack",
    // itunesSubtitle: "I am a sub title",
    // itunesSummary: "I am a summary",
    itunesOwner: {
      name: "Podcast Wikidata",
      email: "podcast.wikidata@gmail.com",
    },
    itunesExplicit: false,
    itunesCategory: [
      {
        text: "Entertainment",
        subcats: [
          {
            text: "Television",
          },
        ],
      },
    ],
    itunesImage: imageUrl,
  });

  // console.log(episodes.data);
  for (const episode of episodes.data) {
    /* loop over data and add to feed */
    episode.wikidataUrl = `https://www.wikidata.org/wiki/${episode.item.value}`;
    let desc = ``;
    // let desc = `This is an episode. <br />Item on Wikidata: ${episode.wikidataUrl}`;
    if (episode.guests) {
      desc += `<br />Guests: ${episode.guests}`;
    }
    if (episode.topics) {
      desc += `<br />Topics: ${episode.topics}`;
    }
    if (episode.recordedAtLabel) {
      desc += `<br />Recorded at: ${episode.recordedAtLabel}`;
    }
    console.log(episode.recordingDate);
    if (episode.recordingDate) {
      let formattedDate = episode.recordingDate.substring(0, 10);
      desc += `<br />Recorded: ${formattedDate}`;
    }
    feed.addItem({
      title: episode.title || episode.item.label, //use label as fallback
      description: desc,
      // url: "http://example.com/article4?this&that", // link to the item
      guid: episode.item.value, // use Wikidata ID, optional - defaults to url
      // categories: ["Category 1", "Category 2", "Category 3", "Category 4"], // optional - array of item categories
      // author: "Guest Author", // optional - defaults to feed author property
      date: episode.publicationDate, // any format that js Date can parse.
      enclosure: { url: episode.url }, // optional enclosure
      itunesDuration: episode.duration,
      itunesExplicit: episode.hasQuality?.value == EXPLICIT_EPISODE,
      itunesEpisode: episode.episodeNumber
        ? episode.episodeNumber
        : episode.productionCode,
      itunesSeason: episode.seasonNumber,
    });
  }
  const xml = feed.buildXml();
  return xml;
}
