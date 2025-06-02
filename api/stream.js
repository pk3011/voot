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

    // Return only the replaced URL as plain text
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send(replacedUrl);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

