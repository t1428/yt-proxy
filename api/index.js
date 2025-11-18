import play from "play-dl";

export default async function handler(req, res) {
  const { id, type } = req.query;

  if (!id) return res.status(400).send("Missing YouTube video ID");

  try {
    // جلب معلومات الفيديو/البث
    const info = await play.video_info(`https://www.youtube.com/watch?v=${id}`);

    // رابط البث أو الفيديو
    const streamUrl = info.url;

    if (!streamUrl) {
      return res.status(404).send("Stream not found");
    }

    if (type === "m3u") {
      // إرجاع ملف M3U للبث
      res.setHeader("Content-Type", "application/x-mpegURL");
      res.send(`#EXTM3U\n#EXTINF:-1,${info.video_details.title}\n${streamUrl}`);
    } else {
      // إرجاع الرابط مباشرة
      res.send(streamUrl);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send(`Error fetching YouTube stream: ${err.message}`);
  }
}
