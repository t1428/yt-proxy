import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { id, type } = req.query;
  if (!id) return res.status(400).send("Missing YouTube video ID");

  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    
    // لجميع البثوث المباشرة والخاصة
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
    
    if (!format || !format.url) return res.status(404).send("Stream not found");

    if (type === "m3u") {
      res.setHeader("Content-Type", "application/x-mpegURL");
      res.send(`#EXTM3U\n#EXTINF:-1,${info.videoDetails.title}\n${format.url}`);
    } else {
      res.send(format.url);
    }

  } catch (err) {
    console.error(err);
    res.status(500).send(`Error fetching YouTube stream: ${err.message}`);
  }
}
