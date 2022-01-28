import { WD_FEED_URL, WD_PODCAST_IMAGE_URL } from "./wikidata";

import { sparql } from "./getWikidataSparql";

export async function getPodcastInfo(podcast: string) {
  let data = `SELECT ?item ?itemLabel ?language ?languageLabel ?languageCode ?genre ?genreLabel ?producer ?producerLabel  ?presenter ?presenterLabel ?itunesGenre ?itunesGenreId ?logo
WHERE 
{
  VALUES ?item {wd:${podcast}}
  OPTIONAL { ?item wdt:P407 ?language.
  ?language wdt:P218 ?languageCode . }
  OPTIONAL { ?item wdt:P136 ?genre. }  
  OPTIONAL { ?item wdt:P495 ?country. }  
  OPTIONAL { ?item wdt:P162 ?producer. }  
  OPTIONAL { ?item wdt:P371 ?presenter. }  
  OPTIONAL { ?item wdt:P10150 ?itunesGenre. }  
  OPTIONAL { ?itunesGenre wdt:P10151 ?itunesGenreId. }  
  OPTIONAL { ?item wdt:${WD_PODCAST_IMAGE_URL} ?logo. }  

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`;
  const ids = await sparql(data);
  return ids;
}

export async function getPodcastFeed(podcast: string) {
  let data = `SELECT ?item ?itemLabel ?language ?feed ?languageLabel ?languageCode ?genre ?genreLabel ?producer ?producerLabel  ?presenter ?presenterLabel ?itunesGenre ?itunesGenreId ?logo
WHERE 
{
  VALUES ?item {wd:${podcast}}
  OPTIONAL { ?item wdt:P407 ?language.
  ?language wdt:P218 ?languageCode . }
  OPTIONAL { ?item wdt:${WD_FEED_URL} ?feed. }  
  OPTIONAL { ?item wdt:P136 ?genre. }  
  OPTIONAL { ?item wdt:P495 ?country. }  
  OPTIONAL { ?item wdt:P162 ?producer. }  
  OPTIONAL { ?item wdt:P371 ?presenter. }  
  OPTIONAL { ?item wdt:P10150 ?itunesGenre. }  
  OPTIONAL { ?itunesGenre wdt:P10151 ?itunesGenreId. }  
  OPTIONAL { ?item wdt:${WD_PODCAST_IMAGE_URL} ?logo. }  

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`;
  const ids = await sparql(data);
  return ids;
}
