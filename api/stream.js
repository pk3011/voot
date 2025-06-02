import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    res.status(400).send("Missing 'id' query parameter");
    return;
  }

  try {
    // Read get.txt file content (base URL)
    const filePath = path.resolve("./get.txt");
    let baseUrl = await fs.readFile(filePath, "utf8");
    baseUrl = baseUrl.trim();

    if (!baseUrl) {
      res.status(500).send("Base URL not found in get.txt");
      return;
    }

    // Replace the fixed id part with requested id
    const replacedUrl = baseUrl.replace("StarSports_2_Hin_HD_voot_MOB", id);

    // Fetch the replaced URL
    const response = await fetch(replacedUrl);
    if (!response.ok) {
      res.status(response.status).send(`Failed to fetch stream: ${response.statusText}`);
      return;
    }

    const body = await response.text();

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(body);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
}
