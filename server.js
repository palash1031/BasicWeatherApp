import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Exchange.html"));
});

// API route
app.get("/api/rate", async (req, res) => {
  const baseCurrency = req.query.base;

  if (!baseCurrency) {
    return res.status(400).json({ error: "Base currency is required" });
  }

  const API_KEY = process.env.API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`;
  console.log(`Fetching data from: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      console.error("API Error:", data.error);
      res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error.message);
    res.status(500).json({ error: `Failed to fetch exchange rates: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});