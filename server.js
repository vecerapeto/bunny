import express from "express";
import fetch from "node-fetch";
import cors from "cors";

import { BUNNY_API_KEY, LIBRARY_ID } from "./config.js";

const app = express();
app.use(cors());

app.get("/api/videos", async (req, res) => {
    try {
        const response = await fetch(
            `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
            {
                headers: {
                    AccessKey: BUNNY_API_KEY
                }
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server beží na http://localhost:3000");
});