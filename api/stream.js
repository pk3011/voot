export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    res.status(400).send("Missing 'id' query parameter");
    return;
  }

  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    res.status(500).send("BASE_URL environment variable not set");
    return;
  }

  try {
    const replacedUrl = baseUrl.replace("StarSports_2_Hin_HD_voot_MOB", id);

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
