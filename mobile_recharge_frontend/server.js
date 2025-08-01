const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Replace the folder name with your actual build output folder
const distPath = path.join(__dirname, "dist/mobile_recharge_frontend");

// ✅ Serve static Angular files
app.use(express.static(distPath));

// ✅ Redirect all routes to index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
  res.sendFile(
    path.join(__dirname, "dist/mobile_recharge_frontend/browser/index.html")
  );
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
