export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).send("❌ Missing ?id= parameter");

  const templateURL = "https://star-sports-2-hindi-hd.joker-verse.workers.dev/index.m3u8";

  try {
    // Fetch upstream playlist content
    const response = await fetch(templateURL, { method: "GET" });

    if (!response.ok) {
      return res.status(response.status).send(`❌ Upstream error: ${response.statusText}`);
    }

    const body = await response.text();

    // Look for URL inside the playlist content containing jiotvmblive.cdn.jio.com
    const urlMatch = body.match(/https:\/\/jiotvmblive\.cdn\.jio\.com\/[^\s'"]+/);

    if (!urlMatch) {
      return res.status(500).send("❌ Failed to extract tokenized CDN URL inside playlist");
    }

    // Replace the original channel ID with the requested id
    const originalID = "StarSports_2_Hin_HD_voot_MOB";
    const extractedURL = urlMatch[0];
    const finalURL = extractedURL.replace(originalID, id);

    // Replace the URL inside the playlist body with new finalURL
    const modifiedBody = body.replace(extractedURL, finalURL);

    // Return modified playlist
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    return res.status(200).send(modifiedBody);

  } catch (err) {
    return res.status(500).send("❌ Error: " + err.message);
  }
}
