import express from "express";
import cors from "cors";
import { scrapeHAC } from "./scrapeHAC.js"; // make sure the path is correct

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/sync-hac", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Missing credentials" });
  }

  try {
    const data = await scrapeHAC({ username, password });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Scraper error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
