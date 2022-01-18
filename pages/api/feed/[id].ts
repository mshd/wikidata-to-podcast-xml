import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const feed = fs.readFileSync(
    __dirname + "/../../../../../public/feeds/" + id + ".xml"
  );
  res.statusCode = 200;
  // res.json({ name: "Jordan Peterson", fetched: true });
  // res.setHeader("Content-Type", "application/xml");
  res.end(feed);
}
