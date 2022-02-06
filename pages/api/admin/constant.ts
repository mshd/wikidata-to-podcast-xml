import type { NextApiRequest, NextApiResponse } from "next";

import { createConstants } from "../../../src/wikidata/createConstantsFile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createConstants();
  res.json({
    error: false,
  });
}
