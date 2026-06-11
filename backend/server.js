require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware (ONLY ONCE)
app.use(cors({
  origin: "*",   // allow all (for now, good for Netlify testing)
}));
app.use(express.json());

// ================= MONGODB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ================= SCHEMA =================
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// ================= ROUTE =================
app.post("/api/contact", async (req, res) => {
  try {
    console.log("DATA RECEIVED:", req.body);

    const newMessage = new Contact(req.body);
    await newMessage.save();

    res.status(200).json({ success: true, message: "Saved successfully" });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});