// api/play.m3u8.js

import channels from '../channels.json';

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const id = searchParams.get('id');

    if (!id) {
      return res.status(400).send('Missing "id" parameter');
    }

    const channel = channels.data.find(c => c.id === id);

    if (!channel || !channel.url) {
      return res.status(404).send('Channel not found or missing URL');
    }

    return res.redirect(302, channel.url);
  } catch (err) {
    console.error('❌ Error in /api/play.m3u8:', err);
    res.status(500).send('Internal Server Error');
  }
}
