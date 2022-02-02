import fs from "fs";
import path from "path";
import { sparql } from "./getWikidataSparql";

export async function createConstants() {
  let query = `SELECT ?p ?pt ?pLabel  WHERE {
      ?p wikibase:propertyType ?pt .
#       OPTIONAL {?p skos:altLabel ?alias FILTER (LANG (?alias) = "en")}
#       OPTIONAL {?p schema:description ?d FILTER (LANG (?d) = "en") .}
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
    }}
`;

  const data = await sparql(query);
  let output = "";
  data.forEach((item: any) => {
    output += `export const WD_${item.p.label
      .replaceAll(/\W+/g, "_")
      .toUpperCase()} = "${item.p.value}";\n`;
  });
  console.log(output);

  await fs.writeFileSync(
    path.resolve(__dirname, "../../../../../src/wikidata/properties.ts"),
    output
  );
}
