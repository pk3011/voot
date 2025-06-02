import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing 'id' query parameter" });
  }

  try {
    // Read get.txt file content
    const filePath = path.resolve("./get.txt");
    let baseUrl = await fs.readFile(filePath, "utf8");
    baseUrl = baseUrl.trim();

    if (!baseUrl) {
      return res.status(500).json({ error: "Base URL not found in get.txt" });
    }

    // Replace channel id placeholder with requested id
    const replacedUrl = baseUrl.replace("StarSports_2_Hin_HD_voot_MOB", id);

    // Option 1: Return replaced URL only
    return res.status(200).json({ url: replacedUrl });

    // Option 2: Fetch content from replaced URL and return content
    // const response = await fetch(replacedUrl);
    // if (!response.ok) {
    //   return res.status(response.status).json({ error: `Failed to fetch stream: ${response.statusText}` });
    // }
    // const body = await response.text();
    // res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    // return res.status(200).send(body);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
