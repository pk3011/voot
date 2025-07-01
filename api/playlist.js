import channels from '../channels.json';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  let m3uPlaylist = '#EXTM3U x-tvg-url="https://avkb.short.gy/jioepg.xml.gz"\n\n';

  for (const channel of channels.data) {
    const id = channel.id || 'unknown';
    const name = channel.channel_name || 'Unknown';
    const logo = channel.logo || '';
    const group = channel.genre || 'General';
    const userAgent = channel.user_agent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

    const host = request.headers.get('host');
    const baseUrl = `https://${host}/api/play.m3u8?id=${encodeURIComponent(id)}`;

    m3uPlaylist += `#EXTINF:-1 tvg-id="${id}" tvg-name="${name}" tvg-logo="${logo}" group-title="${group}",${name}\n`;
    m3uPlaylist += `#EXTVLCOPT:http-user-agent=${userAgent}\n`;
    m3uPlaylist += `${baseUrl}\n\n`;
  }

  return new Response(m3uPlaylist, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
