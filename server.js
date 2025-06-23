import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Sylla Scraper Backend is alive');
});

// Your scraper POST route
app.post('/sync-sis', async (req, res) => {
  try {
    const { username, password, user_id, district } = req.body;

    if (!username || !password || !user_id || !district) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // TODO: Call your scrapeHAC and syncToSupabase functions here
    // For now, just return received data as a test
    res.json({ success: true, received: req.body });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
