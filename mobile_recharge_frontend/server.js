const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Replace the folder name with your actual build output folder
const distPath = path.join(__dirname, "dist/mobile-recharge-frontend");

// ✅ Serve static Angular files
app.use(express.static(distPath));

// ✅ Redirect all routes to index.html (SPA fallback)
app.get("*", (req, res) => {
<<<<<<< HEAD
  res.sendFile(path.join(distPath, "index.html"));
=======
  res.sendFile(
    path.join(__dirname, "dist/mobile_recharge_frontend/browser/index.html")
  );
>>>>>>> e8d7954736a599a2f0aab1752409950c67b2be22
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
