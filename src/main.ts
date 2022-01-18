import { Podcast } from "podcast";
import axios from "axios";
//@ts-ignore
import wdk from "wikidata-sdk";
const EXPLICIT_EPISODE = "Q109501804";

export async function createXML(
  podcastId: string,
  limit: number
): Promise<string> {
  const podcast = await wikidataGetEntities([podcastId]);
  const claims = podcast.claims;
  let descr = "";
  if (claims.P5842) {
    descr += `<br />External links: <a href="https://podcasts.apple.com/podcast/id${claims.P5842[0].value}">Apple Podcasts</a>`;
  }
  const feed = new Podcast({
    title: podcast.labels.en,
    description:
      `This podcast was generated using Wikidata<br>Language: ${claims.P407?.[0].value}` +
      descr,
    feedUrl: "http://example.com/rss.xml",
    siteUrl: claims.P856?.[0].value,
    // imageUrl: "http://example.com/icon.png",
    // docs: "http://example.com/rss/docs.html",
    // author: "Dylan Greene",
    // managingEditor: "Dylan Greene",
    // webMaster: "Dylan Greene",
    // copyright: "2013 Dylan Greene",
    language: "en",
    // categories: ["Category 1", "Category 2", "Category 3"],
    pubDate: claims.P580?.[0].value,
    ttl: 60,
    // itunesAuthor: "Max Nowack",
    // itunesSubtitle: "I am a sub title",
    // itunesSummary: "I am a summary",
    // itunesOwner: { name: "Max Nowack", email: "max@unsou.de" },
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
    itunesImage: "http://example.com/image.png",
  });

  const episodes = await getEpisodesById(podcastId, limit);
  // console.log(episodes);
  for (const episode of episodes) {
    /* loop over data and add to feed */
    episode.wikidataUrl = `https://www.wikidata.org/wiki/${episode.item.value}`;
    feed.addItem({
      title: episode.title,
      description: `This description does not exist. It can include html.<br /><a href="${episode.wikidataUrl}">Item on Wikidata</a>`,
      // url: "http://example.com/article4?this&that", // link to the item
      // guid: "1123", // optional - defaults to url
      // categories: ["Category 1", "Category 2", "Category 3", "Category 4"], // optional - array of item categories
      // author: "Guest Author", // optional - defaults to feed author property
      date: episode.publicationDate, // any format that js Date can parse.
      enclosure: { url: episode.url }, // optional enclosure
      itunesDuration: episode.duration,
      itunesExplicit: episode.hasQuality?.value == EXPLICIT_EPISODE,
      itunesEpisode: episode.episodeNumber,
      itunesSeason: episode.seasonNumber,
    });
  }
  // return feed;
  // cache the xml to send to clients
  const xml = feed.buildXml();
  return xml;
}

export async function getEpisodesById(podcast: string, limit: number) {
  let data = `
SELECT ?item ?itemLabel ?title ?url ?publicationDate ?duration ?hasQuality ?seasonNumber ?episodeNumber
WHERE 
{
  ?item wdt:P31 wd:Q61855877.
  ?item wdt:P179 wd:${podcast}.
  ?item wdt:P1476 ?title .
  OPTIONAL {?item wdt:P953 ?url .}
  OPTIONAL { ?item wdt:P577 ?publicationDate . }
  OPTIONAL { ?item wdt:P2047 ?duration . }
  OPTIONAL { ?item wdt:P1552 ?hasQuality . }
  OPTIONAL { ?item p:P4908 ?seasonStatement . 
             ?seasonStatement ps:P4908 ?season.
             ?seasonStatement pq:P1545 ?episodeNumber.
             ?season p:P179 ?seriesStatement . 
             ?seriesStatement pq:P1545 ?seasonNumber.
             }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`;
  if (limit > 0) {
    data += `\nLIMIT ${limit}`;
  }
  const ids = await sparql(data);
  return ids;
}
async function sparql(query: string) {
  const url = await new Promise<string>((resolve, reject) => {
    try {
      const url = wdk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
  return axios
    .get(url)
    .then(({ data }) => wdk.simplify.sparqlResults(data))
    .then((results) => {
      return results;
    });
  // .catch(errorHandler);
}

async function wikidataGetEntities(id: any) {
  const url = await wdk.getEntities({
    ids: [id],
    languages: ["en"],
    // props: ["sitelinks/urls", "claims"],
  });
  console.log(url);
  return await axios.get(url).then(({ data }) =>
    wdk.simplify.entity(data.entities[id], {
      keepQualifiers: true,
      addUrl: true,
    })
  ); //
}
