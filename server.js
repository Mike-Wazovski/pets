const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

// In-memory posts storage (replace with a database in production)
let posts = [];

// GET all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// POST a new pet post
app.post("/api/posts", (req, res) => {
  const { petType, location, description, userId } = req.body;
  if (!petType || !location || !description || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newPost = {
    id: Date.now(), // simple unique ID
    petType,
    location,
    description,
    userId
  };
  posts.push(newPost);
  res.json(newPost);
});

// DELETE a post (only allowed if the current user is the creator)
app.delete("/api/posts/:id", (req, res) => {
  const { userId } = req.body;
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  if (posts[postIndex].userId !== userId) {
    return res.status(403).json({ error: "Not authorized" });
  }
  posts.splice(postIndex, 1);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
