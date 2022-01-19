import axios from "axios";
//@ts-ignore
import wdk from "wikidata-sdk";

export async function wikidataGetEntities(id: any) {
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
