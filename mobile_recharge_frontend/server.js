const express = require("express");
const path = require("path");
const app = express();

const frontendPath = path.join(
  __dirname,
  "dist/mobile_recharge_frontend/browser"
);
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
