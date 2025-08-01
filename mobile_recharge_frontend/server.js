const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist/mobile_recharge_frontend")));

// Fallback to index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/mobile_recharge_frontend/browser/index.html")
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
