export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("❌ Missing ?id= parameter");
  }

  const templateURL = "https://star-sports-2-hindi-hd.joker-verse.workers.dev/index.m3u8";

  try {
    // Fetch redirect from template URL without following it
    const response = await fetch(templateURL, {
      method: "GET",
      redirect: "manual",
    });

    const location = response.headers.get("Location");

    if (!location || !location.includes("jiotvmblive.cdn.jio.com")) {
      return res.status(500).send("❌ Failed to extract tokenized CDN URL");
    }

    // Replace channel ID in tokenized URL
    const finalURL = location.replace(/StarSports_2_Hin_HD_voot_MOB/g, id);

    // Optional: You can return a redirect or proxy the stream
    const stream = await fetch(finalURL, {
      headers: {
        "Referer": "https://jiotv.com",
        "Origin": "https://jiotv.com",
        "User-Agent": req.headers["user-agent"] || ""
      }
    });

    const contentType = stream.headers.get("content-type");
    const body = await stream.text();

    res.setHeader("Content-Type", contentType || "application/vnd.apple.mpegurl");
    return res.status(200).send(body);

  } catch (err) {
    return res.status(500).send("❌ Error: " + err.message);
  }
}
