import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { id, type } = req.query;

  if (!id) return res.status(400).send("Missing YouTube video ID");

  try {
    // تحقق من البث الحي
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    const formats = ytdl.filterFormats(info.formats, "audioandvideo");

    // اختر أفضل جودة HLS
    const hlsFormat = formats.find(f => f.mimeType.includes("video/mp4") && f.url);
    if (!hlsFormat) return res.status(404).send("HLS stream not found");

    const hlsUrl = hlsFormat.url;

    if (type === "m3u") {
      // إرجاع ملف M3U
      res.setHeader("Content-Type", "application/x-mpegURL");
      res.send(`#EXTM3U\n#EXTINF:-1,${info.videoDetails.title}\n${hlsUrl}`);
    } else {
      // إرجاع الرابط مباشرة
      res.send(hlsUrl);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching YouTube stream");
  }
}
