

exports.imageProxy = async (req, res) => {
  const imageUrl = req.query.url;
  console.log('imageUrl:', imageUrl);

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://lh3.googleusercontent.com",
      },
    });


    if (!response.ok) {
      throw new Error(`Failed to fetch image, status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // ใช้ Content-Type จาก Response
    res.set(
      "Content-Type",
      response.headers.get("content-type") || "image/jpeg"
    );
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
};
