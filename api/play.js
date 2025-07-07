const M3U_URL = 'https://raw.githubusercontent.com/alex4528/m3u/main/z5.m3u';

async function fetchAndParseM3U() {
  const res = await fetch(M3U_URL);
  const text = await res.text();
  const lines = text.trim().split('\n');
  const channels = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const extinf = lines[i];
      const userAgentLine = lines[i + 1].startsWith('#EXTVLCOPT') ? lines[i + 1] : '';
      const url = lines[i + 2];

      const tvgIdMatch = extinf.match(/tvg-id="(.*?)"/);
      const tvgNameMatch = extinf.match(/,(.+)$/);
      const logoMatch = extinf.match(/tvg-logo="(.*?)"/);
      const groupMatch = extinf.match(/group-title="(.*?)"/);
      const uaMatch = userAgentLine.match(/http-user-agent=(.+)/);

      if (tvgIdMatch && url) {
        channels.push({
          id: tvgIdMatch[1],
          name: tvgNameMatch ? tvgNameMatch[1] : '',
          logo: logoMatch ? logoMatch[1] : '',
          group: groupMatch ? groupMatch[1] : '',
          ua: uaMatch ? uaMatch[1] : '',
          url: url.trim()
        });
      }
    }
  }

  return channels;
}

export default async function handler(req, res) {
  const channels = await fetchAndParseM3U();
  const id = req.query.id;

  const channel = channels.find(c => c.id === id);

  if (channel) {
    res.writeHead(302, { Location: channel.url });
    res.end();
  } else {
    res.status(404).send('Channel not found');
  }
}
