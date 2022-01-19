import { sparql } from "./getWikidataSparql";
//@ts-ignore
import wdk from "wikidata-sdk";

export async function getEpisodesById(podcast: string, limit: number) {
  const ORDER_BY = "DESC";
  let query = `#podcast
SELECT ?item ?itemLabel ?title ?url ?publicationDate ?duration ?hasQuality ?seasonNumber ?episodeNumber ?recordedAtLabel ?recordingDate ?productionCode (GROUP_CONCAT(DISTINCT ?guestLabel;separator=", ") AS ?guests) (GROUP_CONCAT(DISTINCT ?mainSubjectLabel;separator=", ") AS ?topics) 
WHERE 
{
  ?item wdt:P31 wd:Q61855877.
  ?item wdt:P179 wd:${podcast}.
  ?item wdt:P1476 ?title .
  #?item wdt:P953 ?url .
  ?item p:P953 ?urlStatement .
  ?urlStatement ps:P953 ?url .
  ?urlStatement pq:P2701 wd:Q42591 . #only mp3
  OPTIONAL { ?item wdt:P577 ?publicationDate . }
  OPTIONAL { ?item wdt:P2047 ?duration . }
  OPTIONAL { ?item wdt:P1552 ?hasQuality . }
  OPTIONAL { ?item wdt:P483 ?recordedAt . }
  OPTIONAL { ?item wdt:P10135 ?recordingDate . }
  OPTIONAL { ?item wdt:P2364 ?productionCode . }
  OPTIONAL { ?item wdt:P921 ?mainSubject . }
  OPTIONAL { ?item p:P4908 ?seasonStatement . 
             ?seasonStatement ps:P4908 ?season.
             ?seasonStatement pq:P1545 ?episodeNumber.
             ?season p:P179 ?seriesStatement . 
             ?seriesStatement pq:P1545 ?seasonNumber.
            }
  OPTIONAL { ?item wdt:P5030 ?guest }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". ?guest rdfs:label ?guestLabel . ?recordedAt rdfs:label ?recordedAtLabel .?mainSubject rdfs:label ?mainSubjectLabel .}
}
GROUP BY ?item ?itemLabel ?title ?url ?publicationDate ?duration ?hasQuality ?seasonNumber ?episodeNumber ?recordedAtLabel ?recordingDate ?productionCode
ORDER BY ${ORDER_BY}(?publicationDate)
`;
  // { ?urlStatement pq:P2701 wd:Q42591 . } UNION { FILTER regex(STR(?url), ".mp3$", "i") }
  if (limit > 0) {
    query += `\nLIMIT ${limit}`;
  }
  try {
    const data = await sparql(query);
    // fs.writeFileSync("ids.json", JSON.stringify(ids));
    return {
      query,
      data,
      link: wdk.sparqlQuery(query),
    };
  } catch (er) {
    throw new Error("couldn't get episodes");
  }
}
