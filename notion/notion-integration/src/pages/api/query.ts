import type { NextApiRequest, NextApiResponse } from "next";
import { Client as NotionClient } from "@notionhq/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const notion = new NotionClient({ auth: process.env.NOTION_KEY });

    const queryRes = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
    });

    const { results } = queryRes;

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json(error);
  }
}
