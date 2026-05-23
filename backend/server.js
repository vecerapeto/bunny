import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "./models/User.js";

import { JWT_SECRET } from "./config.js";

const cors = require("cors");

app.use(cors({
    origin: "*"
}));

import {
    BUNNY_API_KEY,
    LIBRARY_ID,
    CDN_BASE
} from "./config.js";

const app = express();
mongoose.connect(
    "mongodb://127.0.0.1:27017/mycinema"
);

console.log("MongoDB pripojené");

app.use(cors());
app.use(express.json());

app.get("/api/videos", async (req, res) => {

    try {

        const response = await fetch(
            `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
                headers: {
                    AccessKey: BUNNY_API_KEY
                }
            }
        );

        const data = await response.json();

        const videos = data.items.map(video => {

            return {
                guid: video.guid,
                title: video.title.replaceAll("+", " "),
                status: video.status,
                encodeProgress: video.encodeProgress,
                length: video.length,
                views: video.views,
                dateUploaded: video.dateUploaded,

                thumbnail: `${CDN_BASE}/${video.guid}/thumbnail.jpg`,

                player: `https://player.mediadelivery.net/play/${LIBRARY_ID}/${video.guid}`,

                iframe: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${video.guid}`
            };
        });

        res.json(videos);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});
app.post("/api/register", async (req, res) => {

    try {

        const { username, password } = req.body;

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/api/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({
            username
        });

        if (!user) {

            return res.status(401).json({
                error: "Používateľ neexistuje"
            });

        }

        const valid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!valid) {

            return res.status(401).json({
                error: "Zlé heslo"
            });

        }

        const token = jwt.sign({
                id: user._id
            },
            JWT_SECRET, {
                expiresIn: "7d"
            }
        );

        res.json({
            token
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.listen(3000, () => {
    console.log("Backend beží na http://localhost:3000");
});