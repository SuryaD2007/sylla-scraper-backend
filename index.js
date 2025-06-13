import express from "express";
import cors from "cors";
import { scrapeHAC } from "./scrapeHAC.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const data = await scrapeHAC({ username, password });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Scraper API running on :3000"));
