const randomIdGenerator = require("../utils/functions/randomIdGenerator");
const { URL } = require("../models/urlModel");

const handleURLShortening = async (req, res) => {
  try {
    const { originalURL } = req.body;

    if (!originalURL) {
      return res.status(400).json({
        error: "URL is required",
      });
    }

    const existingURL = await URL.findOne({ originalURL });
    if (existingURL) {
      return res.status(400).json({
        error: "URL already exists",
      });
    }

    let shortId;
    let isUnique = false;
    while (!isUnique) {
      shortId = randomIdGenerator(8);
      const existingShortId = await URL.findOne({ shortId });
      if (!existingShortId) {
        isUnique = true;
      }
    }

    await URL.create({
      shortId: shortId,
      originalURL: originalURL,
      clicks: {
        timeStamps: {
          timeStamp: Date.now(),
        },
      },
    });

    return res.status(200).json({
      message: "Short URL created successfully",
      shortId: shortId,
    });
  } catch (error) {
    console.error("Error occurred while creating short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeShortURL = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await URL.findOne({
      shortId: id,
    });

    if (!url) {
      return res.status(404).json({
        error: "Short URL is not found",
      });
    }

    await URL.deleteOne({
      shortId: id,
    });

    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error occurred while deleting short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateShortURL = async (req, res) => {
  const { id } = req.params;
  const { newShortId } = req.body;

  try {
    const existingURL = await URL.findOne({ shortId: newShortId });

    if (existingURL) {
      return res.status(400).json({
        message: "ShortID already exists",
      });
    }

    const url = await URL.findOneAndUpdate(
      { shortId: id },
      { $set: { shortId: newShortId } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({
        message: "ShortURL not found",
      });
    }

    return res.status(200).json({
      message: "ShortURL updated successfully",
    });
  } catch (error) {
    console.error("Error occurred while updating short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const redirectShortURL = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await URL.findOne({ shortId: id });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    } else {
      url.clicks.timeStamps.push({ timeStamp: Date.now() });
      await url.save();
      return res.redirect(url.originalURL);
    }
  } catch (error) {
    console.error("Error occurred while redirecting short URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllShortenedURLs = async (req, res) => {
  try {
    const links = await URL.find({});

    if (links.length === 0) {
      return res.status(404).json({
        message: "No shortened URLs found",
      });
    }

    return res.status(200).json({
      links,
    });
  } catch (error) {
    console.error("Error occurred while retrieving shortened URLs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleURLShortening,
  removeShortURL,
  updateShortURL,
  redirectShortURL,
  getAllShortenedURLs,
};
