const express = require("express");
const {
  handleURLShortening,
  removeShortURL,
  updateShortURL,
  redirectShortURL,
  getAllShortenedURLs,
} = require("../controllers/urlController");

const router = express.Router();

router.get("/", getAllShortenedURLs);

router.post("/", handleURLShortening);

router.get("/:id", redirectShortURL);

router.put("/:id", updateShortURL);

router.delete("/:id", removeShortURL);

module.exports = router;
