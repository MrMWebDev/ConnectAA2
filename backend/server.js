const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require("./models/Post");
const User = require("./models/User");
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        res.status(201).send("User created");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.password !== password) {
            return res.status(401).send('Incorrect password');
        }

        res.send('Login successful');

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/posts', async (req, res) => {
    try {
        const { content, author } = req.body;
        const post = new Post({
            content,
            author
        });

        await post.save();
        res.status(201).send('Post created');
    } catch (error) {
        res.status(500).send(error.message)
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).send('Post not found');
        }

        res.send('Post deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/posts/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).send('Post not found');
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/posts/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        post.likes += 1;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).sendStatus(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
