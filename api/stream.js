import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send("Missing 'id' query parameter");
  }

  try {
    // Read get.txt file content (your base URL with token & StarSports_2_Hin_HD_voot_MOB placeholder)
    const filePath = path.resolve("./get.txt");
    let baseUrl = await fs.readFile(filePath, "utf8");
    baseUrl = baseUrl.trim();

    if (!baseUrl) {
      return res.status(500).send("Base URL not found in get.txt");
    }

    // Replace channel ID placeholder with requested id
    const streamUrl = baseUrl.replace("StarSports_2_Hin_HD_voot_MOB", id);

    // Fetch the actual M3U8 playlist content from the replaced URL
    const fetchResponse = await fetch(streamUrl);

    if (!fetchResponse.ok) {
      return res.status(fetchResponse.status).send(`Failed to fetch stream: ${fetchResponse.statusText}`);
    }

    // Get playlist text content
    const playlistContent = await fetchResponse.text();

    // Return the playlist with correct content-type header for HLS streaming
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.status(200).send(playlistContent);
  } catch (error) {
    return res.status(500).send(`Error: ${error.message}`);
  }
}
