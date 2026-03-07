const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Seyonix backend running");
});

// contact form route
app.post("/contact", (req, res) => {

  const { name, email, message } = req.body;

  console.log("New Contact Message:");
  console.log(name);
  console.log(email);
  console.log(message);

  res.json({
    success: true,
    message: "Message received successfully"
  });

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});